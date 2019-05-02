import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TimoviService } from '../../../servisi/timovi.service';
import { AuthService } from '../../../servisi/auth.service';
import { environment } from '../../../../environments/environment.prod';
import { UploadService } from '../../../servisi/upload.service';
import { IgraService } from '../../../servisi/igra.service';
import { KorisnikService } from '../../../servisi/korisnik.service';
import { Router } from '@angular/router';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ResourceLoader } from '@angular/compiler';
import { DataService } from '../../../servisi/data.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
	selector: 'app-timovi',
	templateUrl: './timovi.component.html',
	styleUrls: ['./timovi.component.css']
})
export class TimoviComponent implements OnInit
{
	readonly defaultGrbTima: string = environment.rutaDoSlika + 'team-emblem.png';
	readonly uploadSlika: string = environment.rutaDoSlika + 'upload.png';

	timovi: Tim[] = [];
	botovi: Bot[] = [];
	botoviIgre: Bot[] = [];
	igre: Igra[] = [];

	porukaOBrisanjuTima: string;

	korisnik: Korisnik;
	kliknutiTim: Tim;

	nazivNovogTima: string = "";
	izabranaIgra: Igra;
	uploadovanaSlikaTima: File = null;
	porukaODodavanjuTima: string;

	porukaOBrisanjuBota: string;
	id: number;
	brisanjeUToku: boolean;

	//provera da slucajno ne dodje preko url-a do timova drugog korisnika
	gledaSvojProfil: boolean;
	//za statitstiku timova

	nazivTimaZaStatistiku: string;
	public statistikaTima: number[];
	public statistikaLabele: string[];
	public bojeGrafika = [{ backgroundColor: ['rgb(66, 134, 244)', 'rgb(86, 196, 88)', 'rgb(209, 120, 98)'] }];
	public doughnutChartType: string = 'doughnut';

	constructor(
		private timoviService: TimoviService,
		private igraService: IgraService,
		private korisnikService: KorisnikService,
		private uploadService: UploadService,
		private modalService: NgbModal,
		private authService: AuthService,
		private router: Router,
		private dataService: DataService,
		private _translateService: TranslateService
	) { }

	ngOnInit()
	{
		this.pokupiPodatke();

		this.router.events.subscribe((event) =>
		{
			this.pokupiPodatke();
		});
	}

	pokupiPodatke()
	{
		this.korisnik = this.authService.loginCheck().user;
		let urlUsername = this.router.url;
		let username = urlUsername.split('/');
		let usernameKorisnikaProfila = username[2];
		let usernameKorisnikaKojiGleda = this.korisnik.username;
		if (usernameKorisnikaKojiGleda == usernameKorisnikaProfila)
		{
			this.gledaSvojProfil = true;
			this.pokupiTimoveIGrbove();
			this.igraService.vratiSveIgre().subscribe((res: any) => this.igre = res);
		}
		else
		{
			this.gledaSvojProfil = false;
		}
	}

	private pokupiTimoveIGrbove()
	{
		this.timoviService.pokupiTimove(this.korisnik.ID).subscribe((res: any) =>
		{
			this.timovi = res;

			this.timovi.forEach(tim =>
			{
				this.timoviService.vratiGrbTima(tim.ID).subscribe(res =>
				{
					this.otvoriSliku(tim, res);
				});
			});
		});
	}

	private otvoriSliku(tim: Tim, fajl: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			tim.grb = reader.result;
		}, false);

		if (fajl)
			reader.readAsDataURL(fajl);
	}

	private sakrijAlert(id: string): void
	{
		$(`#${id}`).hide();
	}

	otvoriPopUpZaBrisanje(id: number): void
	{
		this.id = id;
		this.brisanjeUToku = true;
		$("#modalBrisanjeTima").modal({
			backdrop: 'static',
			show: true
		});
	}

	obrisiTim(): void
	{
		this.timoviService.obrisiTim(this.id).subscribe((res: any) =>
		{
			if (res.success == true)
			{
				this.timoviService.pokupiTimove(this.korisnik.ID).subscribe((res: any) => this.timovi = res);

				this.porukaOBrisanjuTima = "PROFILE_PAGE.TEAM_DELETE_SUCCESS";
				this.dataService.newTimDelete(true);
				$("#porukaOBrisanjuTima").removeClass('alert-danger');
				$("#porukaOBrisanjuTima").addClass('alert-success');
			}
			else
			{
				this.porukaOBrisanjuTima = "PROFILE_PAGE.TEAM_DELETE_FAIL";
				$("#porukaOBrisanjuTima").removeClass('alert-success');
				$("#porukaOBrisanjuTima").addClass('alert-danger');
			}

			$("#porukaOBrisanjuTima").hide().show();
		});
	}

	otvoriPopup(tim: Tim): void
	{
		this.kliknutiTim = tim;
		if (this.kliknutiTim.grb == null)
			this.kliknutiTim.grb = this.defaultGrbTima;

		this.timoviService.pokupiBotoveTima(tim.ID).subscribe((rez: any) => this.botovi = rez);

		$("#Form").modal('show');
	}

	izbaciBota(idBota): void
	{
		this.timoviService.obrisiBotaIzTima(this.kliknutiTim.ID, idBota).subscribe(rez =>	
		{
			let rezultat = <any>rez;

			if (rezultat.success)
			{
				let indeks = this.botovi.findIndex(x => x.ID == idBota);
				this.botovi.splice(indeks, 1);

				this.porukaOBrisanjuBota = "PROFILE_PAGE.BOT_DELETE_SUCCESS";

				$("#porukaOBrisanjuBota").removeClass('alert-danger');
				$("#porukaOBrisanjuBota").addClass('alert-success');
			}
			else
			{
				this.porukaOBrisanjuBota = "PROFILE_PAGE.BOT_DELETE_FAIL";
				$("#porukaOBrisanjuBota").removeClass('alert-success');
				$("#porukaOBrisanjuBota").addClass('alert-danger');
			}

			$("#porukaOBrisanjuBota").hide().show();
		});
	}

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

		// pokupi timove nakon uspesnog dodavanja
		this.pokupiTimoveIGrbove();
	}

	odaberiIgru(): void
	{
		this.izabranaIgra = this.igre.find(x => x.ID == $("#izborIgre").val());
		this.korisnikService.vratiBotoveKorisnikaZaOdredjenuIgru(this.korisnik.ID, this.izabranaIgra.ID).subscribe((res: any) => this.botoviIgre = res);
	}

	ocistiModalZaDodavanjeTima()
	{
		// ciscenje forme
		this.nazivNovogTima = "";
		this.uploadovanaSlikaTima = null;
		$("#izborIgre").val(-1);
		this.izabranaIgra = null;
		this.botoviIgre = [];

		$("#uploadText").css('display', 'block');
		$("#prikazUploada").attr('id', "uploadSlika");
		$("#uploadSlika").attr('src', this.uploadSlika);

		$("#porukaODodavanjuTima").hide();
	}


	dodajTim(): void
	{
		let nizBotovaUTimu = [];
		$(".botoviZaNoviTim:checked").each(function ()
		{
			nizBotovaUTimu.push($(this).val());
		});

		if (this.izabranaIgra == undefined)
			this.postaviPorukuGreske("PROFILE_PAGE.NOT_SELECTED_GAME");
		else if (this.nazivNovogTima == "")
			this.postaviPorukuGreske("PROFILE_PAGE.NOT_DEFINED_TEAM_NAME");
		else if (nizBotovaUTimu.length < this.izabranaIgra.minBrojIgracaUTimu || nizBotovaUTimu.length > this.izabranaIgra.maxBrojIgracaUTimu)
			this.postaviPorukuGreske("PROFILE_PAGE.NOT_SELECTED_BOTS");
		else
		{
			this.timoviService.dodajTim(this.korisnik.ID, this.izabranaIgra.ID, this.nazivNovogTima).subscribe((res: any) =>
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
											this.dataService.newTimAdd(true);
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

	prikaziStatistiku(idTima: number): void
	{
		this.statistikaLabele = [
			this._translateService.instant("PROFILE_PAGE.STATISTICS.WINS"),
			this._translateService.instant("PROFILE_PAGE.STATISTICS.DRAWS"),
			this._translateService.instant("PROFILE_PAGE.STATISTICS.LOSES")
		];

		let tim = this.timovi.find(tim => tim.ID == idTima);
		this.nazivTimaZaStatistiku = tim.naziv;
		let brNeresenih = tim.brojMeceva - tim.brojPobeda - tim.brojPoraza;
		this.statistikaTima = [tim.brojPobeda, brNeresenih, tim.brojPoraza];
	}

	selektovanjeBotaZaNoviTim(ID: Number): void
	{
		var brojSelektovanih = $(".botoviZaNoviTim:checkbox:checked").length;

		if (brojSelektovanih > this.izabranaIgra.maxBrojIgracaUTimu)
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
