import { Component, OnInit, OnDestroy } from '@angular/core';
import { TurnirService } from '../../servisi/turnir.service';
import { isNgTemplate } from '@angular/compiler';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { AuthService } from '../../servisi/auth.service';
import { TimoviService } from '../../servisi/timovi.service';
import { KorisnikService } from '../../servisi/korisnik.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

declare var $: any;

@Component({
	selector: 'app-turniri',
	templateUrl: './turniri.component.html',
	styleUrls: ['./turniri.component.css']
})
export class TurniriComponent implements OnInit, OnDestroy
{
	turnir: Turnir;
	id: string;
	zavrseniMecevi = [];
	meceviUToku = [];
	spisakTimova = [];
	address: string = (this.location as any).location.origin;
	userLinks: string[] = [];
	nazivTurnira: string = "";
	mozePrijava: boolean = false;
	idTurnira: string;

	//potrebno za modal
	korisnik: Korisnik;
	isLogged: boolean;
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
	prijavljen: boolean;
	prijavljenTim: any;
	mozeDaSePrijavi: boolean; //proverava se na osnovu ranga korisnika
	zatvorenePrijave: boolean; //u slucaju ako se vec prijavilo dovoljno korisnika
	
	nijePoceo: boolean; //ako nije poceo turnir da se prikaze tajmer do pocetka turnira
	//podaci za tajmer: 
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	upadateCountDown: any; //tajmer

	constructor(
		private turnirService: TurnirService,
		private route: ActivatedRoute,
		private location: PlatformLocation,
		private authService: AuthService,
		private router: Router,
		private timoviService: TimoviService,
		private korisnikService: KorisnikService
	) { }

	ngOnInit()
	{
		this.id = this.route.snapshot.params.id;
		this.idTurnira = this.route.snapshot.params.id;

		this.pokupiPodatkeKorisnika();
		this.turnirService.vratiTurnir(this.id).subscribe((res: any) =>
		{
			this.turnir = res.turnir;
			//console.log(this.turnir);
			this.spisakTimova = this.turnir.ucesnici;
			this.nazivTurnira = this.turnir.naziv;
			this.turnir.kolo.forEach(kolo =>
			{
				kolo.mecevi.forEach(mec =>
				{
					if (mec.zavrsen == true)
						this.zavrseniMecevi.push(mec);
					else
						this.meceviUToku.push(mec);
				});
			});

			var tempDatumPocetka = new Date(this.turnir.datumPocetka);
			var tempNow = new Date();

			if (this.turnir.zavrsen)
			{
				this.mozePrijava = false;
				this.nijePoceo = false;
			}
			else
			{
				if (tempNow.getTime() >= tempDatumPocetka.getTime())
				{
					this.mozePrijava = false;
					this.nijePoceo = false;
				}
				else
				{
					this.nijePoceo = true;
					this.napraviTajmer(this.turnir.datumPocetka);
					if (this.turnir.maxBrojIgraca > this.turnir.ucesnici.length)
					{
						this.mozePrijava = true;
					}
				}
			}
		});
	}

	ngOnDestroy(): void
	{
		clearInterval(this.upadateCountDown);
	}

	napraviTajmer(endTime)
	{
		var countDownDate = new Date(endTime).getTime();
		this.upadateCountDown = setInterval(function ()
		{
			var now = new Date().getTime();
			var distance = countDownDate - now;
			if (distance > 0)
			{
				this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
				this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
				$("#days").text(this.days);
				$("#hours").text(this.hours);
				$("#min").text(this.minutes);
				$("#sec").text(this.seconds);
			}
			if (distance < 0)
			{
				clearInterval(this.upadateCountDown);
				if (this.route != undefined)
				{
					if (this.route.snapshot.url[0].path == "turnir")
					{
						location.reload();
					}
				}
			}
		}, 1000);
	}

	proveriDaLiSuPrijaveUToku()
	{
		if (this.mozePrijava)
		{
			this.turnirService.proveriDaLiSuPopunjenaMestaNaTurniru(this.idTurnira)
				.subscribe((res: any) =>
				{
					if (res.success)
					{
						if (res.popunjenePrijave)
						{
							this.mozePrijava = false;
						}
						else
						{
							this.pokupiPodatkeKorisnika();
						}
					}
				});
		}
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

	prijava()
	{
		if (this.mozePrijava)
		{
			this.otvoriPopUp(this.idTurnira);
		}
	}

	//prijava tima na turnir
	odvediGaNaStranuProfila()
	{
		this.zatvoriPopup();
		let url = "/profil/" + this.korisnik.username;
		this.router.navigate([url]);
	}

	otvoriPopUp(idTurnira)
	{
		this.izabranTurnir.idTurnira = idTurnira;
		this.pokupiPodatkeZaModal(this.izabranTurnir.idTurnira);
		this.zatvorenePrijave = false;
	}

	pokupiPodatkeZaModal(idTurnira)
	{
		this.turnirService.vratiTurnir(idTurnira).subscribe((res: any) =>
		{
			if (res.success)
			{
				this.izabranTurnir.nazivTurnira = res.turnir.naziv;
				this.izabranTurnir.idIgre = res.turnir.idIgre;
				this.izabranTurnir.nazivIgre = res.turnir.nazivIgre;
				this.izabranTurnir.minRank = res.turnir.minRang;
				this.izabranTurnir.maxRank = res.turnir.maxRang;

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
						this.mozePrijava = false;
					}
					else
					{
						this.zatvorenePrijave = false;
						this.mozePrijava = true;
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
			let nazivTima = $('#izaberiTim option:selected').html();

			this.timoviService.pokupiRankPoeneTima(idIzabranogTima).subscribe((res: any) =>
			{
				if (res.success)
				{
					var rankPoeniTima = res.poeni;
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
			let nazivTima = $('#izaberiTim option:selected').html();

			this.turnirService.prijaviNaTurnir(this.korisnik.ID, this.korisnik.username, idIzabranogTima, nazivTima, this.izabranTurnir.idTurnira)
				.subscribe(res =>
				{
					if (res.success)
					{
						this.mozePrijava = true;
						this.prijavljenTim.naziv = $('#izaberiTim option:selected').text();
						$('#uspesnoPromenjen').show();
					}
				});
		}
	}

	zatvoriPopup(): void
	{
		this.turnirService.vratiTurnir(this.id)
			.subscribe((res: any) =>
			{
				if (res.success)
				{
					this.turnir = res.turnir;
					this.spisakTimova = this.turnir.ucesnici;
				}

			});
		$("#Form").modal('hide');
		$('#uspesnoPrijavljen').hide();
		$('#uspesnoPromenjen').hide();
	}
}
