import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IgraService } from '../../servisi/igra.service';
import { AuthService } from '../../servisi/auth.service';
import { TimoviService } from '../../servisi/timovi.service';
import { KorisnikService } from '../../servisi/korisnik.service';
import { ResponseType } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from '../../servisi/upload.service';
import { BotoviService } from '../../servisi/botovi.service';
import { DataService } from '../../servisi/data.service';
declare var $: any;

@Component({
	selector: 'app-igra',
	templateUrl: './igra.component.html',
	styleUrls: ['./igra.component.css'],
	providers: [IgraService, TimoviService, AuthService, KorisnikService]
})
export class IgraComponent implements OnInit
{
	igra: Igra;
	postoji: boolean = false;
	isLogged: boolean = false;
	private korisnik: Korisnik;
	mecevi: any = [];
	najboljiTimovi: any = [];
	mojiNajboljiTimovi: any = [];
	turniri: any = [];
	jezikEn: boolean;
	slikaIgre: any = null;

	// promenljive za dodavanje tima
	porukaODodavanjuTima: string;
	readonly uploadSlika: string = 'assets/images/' + 'upload.png';
	nazivNovogTima: string = "";
	uploadovanaSlikaTima: File = null;
	botoviIgre: Bot[];

	// promenljive za dodavanje bota
	nazivNovogBota: string = "";
	uploadovaniBot: File = null;
	porukaODodavanjuBota: string;

	constructor(private router: Router,
		private igraService: IgraService,
		private authService: AuthService,
		private timoviService: TimoviService,
		private korisnikService: KorisnikService,
		private translateService: TranslateService,
		private uploadService: UploadService,
		private botoviService: BotoviService,
		private dataService: DataService
	) { }

	ngOnInit()
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

		this.proveriJezik();
		this.prikaziPodatkeZaIgru();

		this.router.events.subscribe((event) =>
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

			this.proveriJezik();
			this.prikaziPodatkeZaIgru();
		});
	}

	proveriJezik()
	{
		if (this.translateService.currentLang == 'en')
		{
			this.jezikEn = true;
		}
		else
		{
			this.jezikEn = false;
		}

		this.translateService.onLangChange.subscribe((event) =>
		{
			if (this.translateService.currentLang == 'en')
			{
				this.jezikEn = true;
			}
			else
			{
				this.jezikEn = false;
			}
		});
	}
	vratiBotoveKorisnikaZaOdredjenuIgru()
	{
		this.korisnikService.vratiBotoveKorisnikaZaOdredjenuIgru(this.korisnik.ID, this.igra.ID).subscribe((res: any) =>
		{
			this.botoviIgre = res;
		});
	}
	prikaziPodatkeZaIgru()
	{
		let url = this.router.url;
		let nazivUrl = url.split('/');
		let nazivIgre = nazivUrl[2];

		this.igraService.vratiIgruPoNazivu(nazivIgre).subscribe((res: any) =>
		{
			if (res.success)
			{
				this.postoji = res.postoji;
				if (res.postoji)
				{
					this.igra = res.igra;
					this.pokupiMeceve(this.igra.ID);
					this.pokupiNajboljeTimove(this.igra.ID);
					this.pokupiTurire(this.igra.ID);
					this.igraService.vratiSlikuIgre(this.igra.ID).subscribe((res: Blob) =>
					{
						this.napraviSlikuOdBloba(res);
					});
					this.vratiBotoveKorisnikaZaOdredjenuIgru();
				}
			}
		});
	}

	pokupiMeceve(idIgre: number)
	{
		this.igraService.vratiPoslednjih10UtakmicaZaIgru(this.igra.ID)
			.subscribe((res: any) =>
			{
				this.mecevi = res.mecevi;
				if (this.mecevi.length > 0)
				{
					this.mecevi.forEach(mec =>
					{
						this.timoviService.pokupiNazivTima(mec.idTima1).subscribe(res =>
						{
							mec.nazivTima1 = res;
						});
						this.timoviService.pokupiNazivTima(mec.idTima2).subscribe(res =>
						{
							mec.nazivTima2 = res;
						});
					});
				}
			});
	}

	pokupiNajboljeTimove(idIgre: number)
	{
		this.igraService.vratiNajboljeTimoveZaOdredjenuIgru(idIgre)
			.subscribe(items =>
			{
				this.najboljiTimovi = items;
			});

		if (this.isLogged)
		{
			this.korisnikService.vratiKorisnikoveNajboljeTimove(this.korisnik.ID, idIgre)
				.subscribe(items =>
				{
					this.mojiNajboljiTimovi = items;
				});
		}
	}

	pokupiTurire(idIgre: number)
	{
		this.igraService.vratiStatusTurniraZaIgru(idIgre).subscribe((res: any) =>
		{
			this.turniri = res.turniri;
		});
	}

	napraviSlikuOdBloba(slika: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			this.slikaIgre = reader.result;
		}, false);
		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

	// Funkcija za modal za dodavanje tima
	otvoriPopupNoviTim(): void
	{
		$('#FormDodajTim').modal('show');
	}

	private postaviPorukuGreske(poruka: string)
	{
		this.porukaODodavanjuTima = poruka;
		$("#porukaODodavanjuTima").removeClass('alert-success');
		$("#porukaODodavanjuTima").addClass('alert-danger');
		$("#porukaODodavanjuTima").hide().show();
	}

	private postaviPorukuUspeha(poruka: string)
	{
		this.ocistiModalZaDodavanjeTima();

		this.porukaODodavanjuTima = poruka;
		$("#porukaODodavanjuTima").removeClass('alert-danger');
		$("#porukaODodavanjuTima").addClass('alert-success');
		$("#porukaODodavanjuTima").hide().show();
	}

	ocistiModalZaDodavanjeTima()
	{
		// ciscenje forme
		this.nazivNovogTima = "";
		this.uploadovanaSlikaTima = null;

		$("#uploadText").css('display', 'block');
		$("#prikazUploada").attr('id', "uploadSlika");
		$("#uploadSlika").attr('src', this.uploadSlika);

		$('.checkboxDiv input').each(function ()
		{
			$(this).prop('checked', false);
		});

		$("#porukaODodavanjuTima").hide();
	}

	sakrijAlert(id: string): void
	{
		$(`#${id}`).hide();
	}

	prikaziUploadovanuSliku(): void
	{
		this.uploadovanaSlikaTima = $("#uploadSlike").prop('files')[0];
		var tipFajla = (this.uploadovanaSlikaTima != null) ? this.uploadovanaSlikaTima.type : undefined;

		if (tipFajla == "image/png" || tipFajla == "image/jpeg")
		{
			var oFReader = new FileReader();
			oFReader.readAsDataURL(this.uploadovanaSlikaTima);

			oFReader.onload = function (oFREvent)
			{
				$("#uploadText").css('display', 'none');
				$("#uploadSlika").attr('id', "prikazUploada");
				$("#prikazUploada").attr('src', oFReader.result);
			};

			if (this.porukaODodavanjuTima == "WRONG_EXT_IMAGE")
				$("#porukaODodavanjuTima").hide();
		}
		else if (tipFajla != undefined)
		{
			this.uploadovanaSlikaTima = null;
			this.postaviPorukuGreske("WRONG_EXT_IMAGE");
		}
	};

	dodajTim(): void
	{
		let nizBotovaUTimu = [];
		$(".botoviZaNoviTim:checked").each(function ()
		{
			nizBotovaUTimu.push($(this).val());
		});

		if (this.nazivNovogTima == "")
			this.postaviPorukuGreske("PROFILE_PAGE.NOT_DEFINED_TEAM_NAME");
		else if (nizBotovaUTimu.length < this.igra.minBrojIgracaUTimu || nizBotovaUTimu.length > this.igra.maxBrojIgracaUTimu)
			this.postaviPorukuGreske("PROFILE_PAGE.NOT_SELECTED_BOTS");
		else
		{
			// indikatori o uspesnosti dodavanja botova u tim i grba
			let botovi = true;
			let grb = true;

			this.timoviService.dodajTim(this.korisnik.ID, this.igra.ID, this.nazivNovogTima).subscribe((res: any) =>
			{
				// tim mora biti dodat, da bi mogli da se dodaju grb i botovi za taj tim
				if (res.success)
				{
					if (res.istiNaziv == true)
						this.postaviPorukuGreske("PROFILE_PAGE.TEAM_WITH_SAME_NAME");
					else
					{
						this.timoviService.dodajBotoveUTim(res.idDodatogTima, nizBotovaUTimu).subscribe(res2 =>
						{
							if (res.success)
							{
								if (this.uploadovanaSlikaTima != null)
								{
									this.uploadService.uploadGrba(res.idDodatogTima, this.uploadovanaSlikaTima).subscribe(res2 =>
									{
										if (res.success)
										{
											this.postaviPorukuUspeha("PROFILE_PAGE.TEAM_ADDED_SUCCESS");
											this.vratiBotoveKorisnikaZaOdredjenuIgru()
											this.pokupiNajboljeTimove(this.igra.ID);
										}
										else
											this.postaviPorukuGreske("PROFILE_PAGE.BADGE_ADDED_FAIL");
									});
								}
								else
									this.postaviPorukuUspeha("PROFILE_PAGE.TEAM_ADDED_SUCCESS");
							}
							else
								this.postaviPorukuGreske("PROFILE_PAGE.TEAM_BOTS_ADDED_FAIL");
						});
					}
				}
				else
					this.postaviPorukuGreske("PROFILE_PAGE.TEAM_ADDED_FAIL");
			});
		}
	}

	// Dodavanje bota
	private prijaviGreskuPriDodavanjuBota(poruka: string)
	{
		this.porukaODodavanjuBota = poruka;
		$("#porukaODodavanjuBota").removeClass('alert-success');
		$("#porukaODodavanjuBota").addClass('alert-danger');
		$("#porukaODodavanjuBota").hide().show();
	}

	promeniFajl(event): void
	{
		let target: any = event.target;
		this.uploadovaniBot = <File>target.files[0];

		if (this.uploadovaniBot != null && this.uploadovaniBot.type != "text/plain")
		{
			this.uploadovaniBot = null;
			this.prijaviGreskuPriDodavanjuBota("WRONG_EXT_BOT");
		}
	}

	ocistiModalZaDodavanjeBota()
	{
		this.nazivNovogBota = "";
		this.uploadovaniBot = null;
		$("#porukaODodavanjuBota").hide();
	}

	dodajBota(): void
	{
		if (this.nazivNovogBota == "")
			this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.NOT_ENTERED_BOT_NAME");
		else if (this.uploadovaniBot == null)
			this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.NOT_SELECTED_BOT_FILE");
		else
		{
			this.uploadService.uploadBota(this.korisnik.ID, this.nazivNovogBota, this.igra.ID, this.uploadovaniBot).subscribe((res: any) =>
			{
				if (res.success == true)
				{
					// ciscenje forme
					this.ocistiModalZaDodavanjeBota();

					this.porukaODodavanjuBota = "PROFILE_PAGE.BOT_ADDED_SUCCESS";
					$("#porukaODodavanjuBota").removeClass('alert-danger');
					$("#porukaODodavanjuBota").addClass('alert-success');
					$("#porukaODodavanjuBota").hide().show();


				}
				else
				{
					if (res.postojiBotSaIstimImenom)
						this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.BOT_WITH_SAME_NAME");
					else
						this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.BOT_ADDED_FAIL");
				}
			});
		}
	}

	selektovanjeBotaZaNoviTim(ID: Number): void
	{
		var brojSelektovanih = $(".botoviZaNoviTim:checkbox:checked").length;

		if (brojSelektovanih > this.igra.maxBrojIgracaUTimu)
		{
			$(`#bot${ID}`).prop('checked', false);

			this.postaviPorukuGreske("MAX_BOTS_SELECTED");
			$(".botoviZaNoviTim:checkbox:not(:checked)").each(function ()
			{
				$(this).prop('disabled', true);
			});
		}
		else
		{
			$("#porukaODodavanjuTima").hide();
			$(".botoviZaNoviTim:checkbox:not(:checked)").each(function ()
			{
				$(this).prop('disabled', false);
			});
		}
	}
}
