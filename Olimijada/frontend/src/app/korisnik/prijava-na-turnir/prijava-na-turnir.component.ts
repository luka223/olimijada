import { Component, OnInit } from '@angular/core';
import { TurnirService } from '../../servisi/turnir.service';
import { AuthService } from '../../servisi/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimoviService } from '../../servisi/timovi.service';
import { Router } from '@angular/router';
import { KorisnikService } from '../../servisi/korisnik.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
declare var $: any;

@Component({
	selector: 'app-prijava-na-turnir',
	templateUrl: './prijava-na-turnir.component.html',
	styleUrls: ['./prijava-na-turnir.component.css']
})
export class PrijavaNaTurnirComponent implements OnInit
{
	turniri: any[] = [];
	izabranTurnir: {
		idTurnira: string,
		nazivTurnira: string,
		idIgre: number,
		nazivIgre: string,
		minRank: number,
		maxRank: number
	} = {
			idTurnira: "0",
			nazivTurnira: "",
			idIgre: 0,
			nazivIgre: "",
			minRank: 0,
			maxRank: 0
		};
	timovi: Tim[] = [];
	korisnik: Korisnik;
	isLogged: boolean;
	prijavljen: boolean;
	prijavljenTim: any;
	mozeDaSePrijavi: boolean; //proverava se na osnovu ranga korisnika
	zatvorenePrijave: boolean; //u slucaju ako se vec prijavilo dovoljno korisnika

	constructor(
		private turnirService: TurnirService,
		private authService: AuthService,
		private timoviService: TimoviService,
		private modalService: NgbModal,
		private router: Router,
		private korisnikService: KorisnikService
	) { }

	ngOnInit()
	{
		this.turnirService.vratiTurnireUNajavi().subscribe((res: any) =>
		{
			if (res.success)
			{
				this.turniri = res.turniri;
			}
			else
			{
				//("doslo je do greske u bazi");
			}
		});

		this.pokupiPodatkeKorisnika();
	}

	odvediGaNaStranuProfila()
	{
		this.zatvoriPopup();
		let url = "/profil/" + this.korisnik.username;
		this.router.navigate([url]);
	}

	otvoriPopUp(idTurnira)
	{
		console.log('usao u popup');
		this.izabranTurnir.idTurnira = idTurnira;
		this.pokupiPodatkeZaModal(this.izabranTurnir.idTurnira);
		this.zatvorenePrijave = false;
	}

	pokupiPodatkeZaModal(idTurnira)
	{
		console.log('usao u moda');
		this.turnirService.vratiTurnir(idTurnira).subscribe((res: any) =>
		{
			if (res.success)
			{
				this.izabranTurnir.nazivTurnira = res.turnir.naziv;
				this.izabranTurnir.idIgre = res.turnir.idIgre;
				this.izabranTurnir.nazivIgre = res.turnir.nazivIgre;
				this.izabranTurnir.minRank = res.turnir.minRang;
				this.izabranTurnir.maxRank = res.turnir.maxRang;
				console.log(res.turnir);

				this.turnirService.proveriDaLiJeVecPrijavljenNaTakmicenje(this.korisnik.ID, this.izabranTurnir.idTurnira)
					.subscribe((res: any) =>
					{
						if (res.success)
						{
							if (res.vecPostoji)
							{
								this.prijavljen = true;
								this.prijavljenTim = res.tim;
								this.prikaziPodatkeKadaJePrijavljen();
							}
							else
							{
								this.prijavljen = false;
								this.prikaziPodatkeKadaNijePrijavljen();
							}

							this.timoviService.pokupiTimoveKorisnikaZaIgru(this.korisnik.ID, this.izabranTurnir.idIgre, this.izabranTurnir.minRank, this.izabranTurnir.maxRank)
								.subscribe((res: any) =>
								{
									this.timovi = res.timovi;
								});
						}
					});
			}
		});
	}

	prikaziPodatkeKadaJePrijavljen()
	{
		$('#izaberiTim option:selected').val(this.prijavljenTim.idTima);
		$("#Form").modal({
			backdrop: 'static',
			show: true
		});
	}

	prikaziPodatkeKadaNijePrijavljen()
	{
		this.turnirService.proveriDaLiSuPopunjenaMestaNaTurniru(this.izabranTurnir.idTurnira)
			.subscribe((res: any) =>
			{
				if (res.success)
				{
					if (res.popunjenePrijave)
					{
						this.zatvorenePrijave = true;
					}
					else
					{
						this.zatvorenePrijave = false;
						//this.proveriDaLiJeRangDobar();

					}
				}
			});
		$("#Form").modal({
			backdrop: 'static',
			show: true
		});
	}

	/*
	proveriDaLiJeRangDobar()
	{
		this.korisnikService.vratiRankPoeneKorisnika(this.korisnik.ID).subscribe((res: any) =>
		{
			if (res.success)
			{
				let poeniKorisnika = res.rankPoeni;
				if ((poeniKorisnika < this.izabranTurnir.maxRank) && (poeniKorisnika > this.izabranTurnir.minRank))
				{
					this.mozeDaSePrijavi = true;
				}
				else
				{
					this.mozeDaSePrijavi = false;
				}
			}
		})
	}
	*/

	proveriModal()
	{
		if (!this.prijavljen)
		{
			let idIzabranogTima = $('#izaberiTim').val();
			let nazivTima = $("#izaberiTim option:selected").html();

			this.timoviService.pokupiRankPoeneTima(idIzabranogTima).subscribe((resRank: any) =>
			{
				if (resRank.success)
				{
					let rankPoeniTima = resRank.poeni;
					if ((toInteger(rankPoeniTima) >= toInteger(this.izabranTurnir.minRank)) && (toInteger(rankPoeniTima) <= toInteger(this.izabranTurnir.maxRank)))
					{
						this.turnirService.prijaviNaTurnir(this.korisnik.ID, this.korisnik.username, idIzabranogTima, nazivTima, this.izabranTurnir.idTurnira)
							.subscribe((res: any) =>
							{ 
								if (res.success)
								{
									this.prijavljenTim = res.tim;
									this.prijavljen = false;
									$('#uspesnoPrijavljen').show();
								}
								else
								{
									//("greska baza");
								}
							});
					}
					else
					{
						this.prijavljen = false;
						$('#timNemaDobarRank').show();
					}
				}
			});
		}
		else
		{
			let idIzabranogTima = $('#izaberiTim').val();
			let nazivTima = $("#izaberiTim option:selected").html();
			this.turnirService.prijaviNaTurnir(this.korisnik.ID, this.korisnik.username, idIzabranogTima, nazivTima, this.izabranTurnir.idTurnira)
				.subscribe(res =>
				{
					if (res.success)
					{
						this.prijavljenTim.naziv = $('#izaberiTim option:selected').text();
						$('#uspesnoPromenjen').show();
					}
				});
		}
	}

	zatvoriPopup(): void
	{
		$("#Form").modal('hide');
		$('#uspesnoPrijavljen').hide();
		$('#uspesnoPromenjen').hide();
	}

	pokupiPodatkeKorisnika()
	{
		if (this.authService.loginCheck().success)
		{
			this.isLogged = true;
			this.korisnik = this.authService.loginCheck().user;
		}
		else
		{
			this.isLogged = false;
		}
	}

	odvediNaStranuTurnira(idTurnira)
	{
		this.zatvoriPopup();
		let url = "turnir/" + idTurnira;
		this.router.navigate([url]);
	}

}
