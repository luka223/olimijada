import { Component, OnInit } from '@angular/core';
import { KorisnikService } from '../../../servisi/korisnik.service';
import { AuthService } from '../../../servisi/auth.service';
import { AdminService } from '../../../servisi/admin.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
	selector: 'app-administracija-korisnika',
	templateUrl: './administracija-korisnika.component.html',
	styleUrls: ['./administracija-korisnika.component.css']
})

export class AdministracijaKorisnikaComponent implements OnInit
{
	private aktivan: number; //aktivan tab

	private idAdmina: number;
	superAdmin: boolean = false; //provera da li je super admin

	korisnici: Korisnik[] = [];
	sviKorisnici: Korisnik[] = [];
	korisniciPretraga = "";
	izabraniKorisnikZaBrisanje = "";
	private brisanjeUToku: boolean;

	izabranNoviAdmin = "";
	private noviAdminUToku: boolean;

	admins: Korisnik[] = [];
	sviAdmini: Korisnik[] = [];
	adminPretraga = "";

	izabranAdminZaBrisanje = "";
	private brisanjeAdmina: boolean;

	private mejlAdresaKorisnika = "";

	constructor(
		private authService: AuthService,
		private adminService: AdminService,
		private router: Router
	) { }

	//dodati pretragu

	ngOnInit()
	{
		this.adminService.proveriToken().subscribe();

		if (this.authService.adminCheck().success)
		{
			this.idAdmina = this.authService.adminCheck().user.ID;
			//dodati proveru da li je super admin
			//this.superAdmin = true;
			let tipAdmina = this.authService.adminCheck().user.idTipaKorisnika;
			if (tipAdmina == 0)
			{
				this.superAdmin = true;
			}
			this.aktivan = 1;
			this.pokupiSveKorisnike();
			this.pokupiSveAdministratore();
		}
		else
		{
			//nema pristup ovom delu sajta
		}
	}

	pokupiSveAdministratore()
	{
		this.adminService.vratiSveAdmine().subscribe((res: any) =>
		{
			if (res.success)
			{
				this.sviAdmini = this.admins = res.admini;
			}
		});
	}

	pokupiSveKorisnike()
	{
		this.adminService.vratiSveKorisnike().subscribe((res: any) =>
		{
			if (res.success)
			{
				this.sviKorisnici = this.korisnici = res.korisnici;
			}
			else
			{
				//doslo je do greske sa bazom
			}
		});
	}

	vratiRezultatePretrage()
	{
		var pretrazi = this.korisniciPretraga.trim();
		if (this.aktivan == 1)
		{
			this.korisnici = this.sviKorisnici.filter(x => x.username.toLowerCase().indexOf(this.korisniciPretraga.toLowerCase()) >= 0
				|| x.email.toLowerCase().indexOf(this.korisniciPretraga.toLowerCase()) >= 0);
		}
		else
		{
			this.admins = this.sviAdmini.filter(x => x.username.toLowerCase().indexOf(this.korisniciPretraga.toLowerCase()) >= 0
				|| x.email.toLowerCase().indexOf(this.korisniciPretraga.toLowerCase()) >= 0);
		}
	}

	otvoriPopUp(username)
	{
		this.izabraniKorisnikZaBrisanje = username;
		this.brisanjeUToku = true;
		$("#brisanje").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUp()
	{
		this.izabraniKorisnikZaBrisanje = "";
		this.brisanjeUToku = false;
		$('#uspesnoObrisan').hide();
		$("#brisanje").modal('hide');
	}

	obrisiKorisnika()
	{
		if (this.brisanjeUToku)
		{
			this.adminService.obrisiKorisnika(this.izabraniKorisnikZaBrisanje).subscribe((res: any) =>
			{
				if (res.success)
				{
					this.pokupiSveKorisnike();
					$('#uspesnoObrisan').show();
					this.brisanjeUToku = false;
				}
				else
				{
					//("nije ga obrisao");
				}
			});
		}
		else
		{
			//("ne moze da ga obrise");
		}
	}

	obrisiPretragu()
	{
		if (this.aktivan == 1)
			this.korisniciPretraga = "";
		else
			this.adminPretraga = "";
	}

	otvoriPopUpZaAdmina(username)
	{
		this.izabranNoviAdmin = username;
		this.noviAdminUToku = true;
		$("#postavljanjeAdmina").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUpZaAdmina()
	{
		this.izabranNoviAdmin = "";
		this.noviAdminUToku = false;
		$('#uspesnoDodat').hide();
		$("#postavljanjeAdmina").modal('hide');
	}

	dodeliAdministratorskaPrava()
	{
		if (this.noviAdminUToku)
		{
			this.adminService.dodeliAdminPrava(this.izabranNoviAdmin).subscribe((res: any) =>
			{
				if (res.success)
				{
					$('#uspesnoDodat').show();
					this.pokupiSveKorisnike();
				}
			})
		}
	}

	otvoriPopUpDaUkloniAdmina(username: string)
	{
		this.izabranAdminZaBrisanje = username;
		this.brisanjeAdmina = true;
		$("#ukloniAdmina").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUpDaUkloniAdmina()
	{
		this.brisanjeAdmina = false;
		this.izabranAdminZaBrisanje = "";
		$("#uspesnoUklonjen").hide();
		$("#ukloniAdmina").modal('hide');
	}

	ukloniAdministratorskaPrava()
	{
		if (this.brisanjeAdmina)
		{
			this.adminService.ukloniAdminPrava(this.izabranAdminZaBrisanje).subscribe((res: any) =>
			{
				if (res.success)
				{
					this.pokupiSveAdministratore();
					this.brisanjeAdmina = false;
					$("#uspesnoUklonjen").show();
				}
				else
				{
					//ne znam sta
				}
			});
		}
	}

	aktivanTab(a: number)
	{
		this.aktivan = a;
		if (this.aktivan == 1)
		{
			this.pokupiSveKorisnike();
		}
		else
		{
			if (this.aktivan == 2)
			{
				this.pokupiSveAdministratore();
			}
		}
	}

	vratiUrlZaProfil(username): string
	{
		return "/profil/" + username;
	}

	otvoriPopUpZaMejl(email)
	{
		this.mejlAdresaKorisnika = email;
		$("#posaljiMejl").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUpZaMejl()
	{
		$("#uspesnoPoslatMejl").hide();
		$("#posaljiMejl").modal('hide');
		this.ocistiFormu();
		this.mejlAdresaKorisnika = "";
	}

	ocistiFormu()
	{
		$("#naslovMejla").val("");
		$("#sadrzajMejla").val("");
		//$("#uspesnoPoslatMejl").fade();
	}

	posaljiMejl()
	{
		var naslov = $("#naslovMejla").val();
		var tekst = $("#sadrzajMejla").val();
		var mejl = "<pre>" + tekst + "</pre>";

		this.adminService.posaljiMejl(this.mejlAdresaKorisnika, naslov, mejl).subscribe((res: any) =>
		{
			if (res.success)
			{
				$("#uspesnoPoslatMejl").show();
			}
		});
	}

	otvoriPopUpZaMejlSvi()
	{
		$("#posaljiMejlSvima").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUpZaMejlSvi()
	{
		$("#uspesnoPoslatMejl").hide();
		$("#posaljiMejlSvima").modal('hide');
		$("#naslovMejlaSvi").val("");
		$("#sadrzajMejlaSvi").val("");
	}

	posaljiMejlSvima()
	{
		var naslov = $("#naslovMejlaSvi").val();
		var tekst = $("#sadrzajMejlaSvi").val();
		var mejl = "<div>" + tekst + "</div>";

		this.adminService.posaljiMejlSvimKorisicima(naslov, mejl).subscribe((res: any) =>
		{
			if (res.success)
			{
				$("#uspesnoPoslatMejlSvi").show();
			}
		});
	}

}
