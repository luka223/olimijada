import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BotoviService } from '../../../servisi/botovi.service';
import { AuthService } from '../../../servisi/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimoviService } from '../../../servisi/timovi.service';
import { UploadService } from '../../../servisi/upload.service';
import { IgraService } from '../../../servisi/igra.service';
import { Router } from '@angular/router';
import { DataService } from '../../../servisi/data.service';
declare var $: any;

@Component({
	selector: 'app-botovi',
	templateUrl: './botovi.component.html',
	styleUrls: ['./botovi.component.css']
})
export class BotoviComponent implements OnInit
{
	// opste promenljive - botovi u tabeli, igre za dropdown i ulogovani korisnik
	botovi: Bot[] = [];
	igre: Igra[] = [];
	korisnik: Korisnik;

	porukaOBrisanjuBota: string;

	// promenljivae vezanje za prikaz bota (kod bota i naziv)
	kliknutiBot: Bot;
	unetiKod: string;
	kodUFajlu: string;
	ekstenzija: string;
	porukaOAzuriranjuFajlaBota: string;

	// promenljive vezane za dodavanje novog bota
	nazivNovogBota: string = "";
	uploadovaniBot: File = null;
	porukaODodavanjuBota: string;
	id: number;
	brisanjeUToku: boolean;

	//provera, ako ulogovani korisnik proba preko url-a da dodje do botova nekog drugog korisnika
	gledaSvojProfil: boolean;

	constructor(
		private botoviService: BotoviService,
		private timoviService: TimoviService,
		private igraService: IgraService,
		private uploadService: UploadService,
		private authService: AuthService,
		private modalService: NgbModal,
		private router: Router
	) { }

	ngOnInit()
	{
		this.pokupiPodatke();

		this.router.events.subscribe((event) =>
		{
			if ((this.router.url.split('/'))[1] == 'profil')
			{
				this.pokupiPodatke();
			}
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
			this.botoviService.pokupiBotove(this.korisnik.ID).subscribe((rez: any) => this.botovi = rez);

			this.ekstenzija = "c_cpp"; // gledace se u odnosu na stvarni fajl bota u kom je jeziku pisan

			// $(".dropdown-menu").on('click', 'option', function ()
			// {
			// 	$("#dropdownMenuButton").text($(this).html());
			// 	$("#dropdownMenuButton").val($(this).val());
			// });

			this.igraService.vratiSveIgre().subscribe((res: any) => this.igre = res);
		}
		else
		{
			this.gledaSvojProfil = false;
		}
	}

	private sakrijAlert(id: string)
	{
		$(`#${id}`).hide();
	}

	otvoriPopupZaBrisanjeBota(id: number): void
	{
		this.id = id;
		this.brisanjeUToku = true;
		$("#modalBrisanjeBota").modal({
			backdrop: 'static',
			show: true
		});
	}

	obrisiBota(): void
	{
		this.botoviService.obrisiBota(this.id).subscribe((res: any) =>
		{
			if (res.success == true)
			{
				this.botoviService.pokupiBotove(this.korisnik.ID).subscribe((res: any) => this.botovi = res);

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

	zatvoriWarning(): void
	{
		$('#Warning').modal('hide');
		$('#FormBot').modal('hide');
		this.unetiKod = this.kodUFajlu;
	}

	private ucitajSadrzajFajla(fajl: Blob)
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			this.kodUFajlu = this.unetiKod = reader.result;
		}, false);

		if (fajl)
			reader.readAsText(fajl);
	}

	otvoriPopup(bot: Bot): void
	{
		this.kliknutiBot = bot;
		this.botoviService.vratiFajlBota(bot.ID).subscribe((res: Blob) =>
		{
			this.ucitajSadrzajFajla(res);
		});

		$("#FormBot").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopup(): void
	{
		if (this.kodUFajlu !== this.unetiKod)
			$("#Warning").modal('show');
		else
		{
			$("#FormBot").modal('hide');
			$("#porukaOAzuriranjuFajlaBota").hide();
		}
	}

	private prijaviGreskuPriDodavanjuBota(poruka: string)
	{
		this.porukaODodavanjuBota = poruka;
		$("#porukaODodavanjuBota").removeClass('alert-success');
		$("#porukaODodavanjuBota").addClass('alert-danger');
		$("#porukaODodavanjuBota").hide().show();
	}

	ocistiModalZaDodavanjeBota()
	{
		this.nazivNovogBota = "";
		this.uploadovaniBot = null;
		//console.log("ocisti modal" + this.uploadovaniBot);
		$("#dropdownIgra").val(-1);
		$("#porukaODodavanjuBota").hide();
	}

	dodajBota(): void
	{
		let idIgre = $("#dropdownIgra").val();

		if (idIgre == -1)
			this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.NOT_SELECTED_GAME");
		else if (this.nazivNovogBota == "")
			this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.NOT_ENTERED_BOT_NAME");
		else if (this.uploadovaniBot == null)
			this.prijaviGreskuPriDodavanjuBota("PROFILE_PAGE.NOT_SELECTED_BOT_FILE");
		else
		{
			this.uploadService.uploadBota(this.korisnik.ID, this.nazivNovogBota, idIgre, this.uploadovaniBot).subscribe((res: any) =>
			{
				if (res.success == true)
				{
					this.ocistiModalZaDodavanjeBota();

					// kupi ponovo botove, zbog prikaza
					this.botoviService.pokupiBotove(this.korisnik.ID).subscribe((res: any) => this.botovi = res);

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

	sacuvajFajl(): void
	{
		this.botoviService.azurirajFajlBota(this.kliknutiBot.ID, this.unetiKod).subscribe((res: any) =>
		{
			// problem sa cuvanjem koda koji pocinje #
			if (res.success == true)
			{
				this.porukaOAzuriranjuFajlaBota = "PROFILE_PAGE.SAVED_CHANGES_SUCCESS";
				$("#porukaOAzuriranjuFajlaBota").removeClass('alert-danger');
				$("#porukaOAzuriranjuFajlaBota").addClass('alert-success');

				this.kodUFajlu = this.unetiKod;
			}
			else
			{
				this.porukaOAzuriranjuFajlaBota = "PROFILE_PAGE.SAVED_CHANGES_SUCCESS";
				$("#porukaOAzuriranjuFajlaBota").removeClass('alert-success');
				$("#porukaOAzuriranjuFajlaBota").addClass('alert-danger');
			}

			$("#porukaOAzuriranjuFajlaBota").hide().show();
		});
	}

	private promeniFajl(event): void
	{
		let target: any = event.target || event.srcElement;
		this.uploadovaniBot = <File>target.files[0];
		target.value = '';
	
		if (this.uploadovaniBot != null && this.uploadovaniBot.type != "text/plain")
		{
			this.uploadovaniBot = null;
			this.prijaviGreskuPriDodavanjuBota("WRONG_EXT_BOT");
		}
	}
}
