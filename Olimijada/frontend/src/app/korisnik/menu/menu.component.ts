import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../servisi/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { IgraService } from '../../servisi/igra.service';
import { KorisnikService } from '../../servisi/korisnik.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { DataService } from '../../servisi/data.service';
declare var $: any;

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit
{
	@Input() isLogged;
	izabraniJezik: string = 'en'; // default je engleski, a u ngOnInit se proverava da li je korisnik logovan, i ako jeste, setuje se njegov jeizk
	user: Korisnik;
	username: string;
	igre: Igra[];
	sveIgre: Igra[];
	igrePretraga: "";
	adminStrana: boolean;
	signInPoruka: string; // da pise sign up ako je ukljucio registraciju, inace sign in

	notifikacije: Notifikacija[] = [];
	izabranaNotifikacija: Notifikacija;
	imaNovihNotifikacija: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		public translate: TranslateService,
		private igraService: IgraService,
		private korisnikService: KorisnikService,
		private _scrollToService: ScrollToService,
		private dataService: DataService
	) 
	{
		if (authService.loginCheck().success == false)
			translate.setDefaultLang("en");
		else
		{
			let jezik = authService.loginCheck().user.jezik;
			translate.setDefaultLang(jezik);
		}
	}


	vratiSveIgreSortiranePoKorisniku()
	{
		this.korisnikService.vratiSveIgreSortiranePoKorisniku(this.user.ID).subscribe((items: any) =>
		{
			this.sveIgre = this.igre = items;

			for (let igra of items)
			{
				this.igraService.vratiIkonuIgre(igra.ID).subscribe(res => this.otvoriSliku(igra, res));
			}
		});
	}

	ngOnInit()
	{
		this.proveriLog();

		this.router.events.subscribe((event) =>
		{
			if ((this.router.url.split('/'))[1].indexOf('admin') >= 0)
				this.adminStrana = true;
			else
				this.adminStrana = false;

			if ((this.router.url.split('/'))[1].indexOf('signup') >= 0)
				this.signInPoruka = "REGISTER";
			else if ((this.router.url.split('/'))[1] == '')
				this.signInPoruka = "LOGIN";
			else
				this.signInPoruka = '';
		});



		if (this.isLogged == true)
		{
			this.izabraniJezik = this.user.jezik;

			// korisnik je ulogovan, pa se vracaju igre sortirane po korisniku
			this.dataService.newIgraChange.subscribe(flag =>
			{
				if (flag)
				{
					console.log(flag);
					this.vratiSveIgreSortiranePoKorisniku();
					this.dataService.newIgraAdd(false);
				}
			})
			this.vratiSveIgreSortiranePoKorisniku()

			// da pozove odmah pri ucitavanju
			this.korisnikService.vratiNotifikacije(this.user.ID).subscribe((res: any) =>
			{
				if (res.success)
					this.notifikacije = res.notifikacije;

				this.imaNovihNotifikacija = this.notifikacije.some(x => x.procitana == 'false');
			});

			// da nastavi da zove svaka dva minuta
			Observable.interval(0.5 * 60 * 1000).timeInterval().flatMap(() => this.korisnikService.vratiNotifikacije(this.user.ID)).subscribe((res: any) =>
			{
				if (res.success)
					this.notifikacije = res.notifikacije;

				this.imaNovihNotifikacija = this.notifikacije.some(x => x.procitana == 'false');
			});
		}
		else
		{
			// korisnik nije ulogovan, pa se vracaju igre sortirane globalno
			this.dataService.newIgraChange.subscribe(flag =>
			{
				if (flag)
				{
					console.log(flag);
					this.vratiSveIgreSortiraneGlobalno();
					this.dataService.newIgraAdd(false);
				}
			})
			this.vratiSveIgreSortiraneGlobalno();
		}
	}
	vratiSveIgreSortiraneGlobalno()
	{
		this.igraService.vratiSveIgreSortiraneGlobalno().subscribe((items: any) =>
		{
			this.sveIgre = this.igre = items;

			for (let igra of items)
			{
				this.igraService.vratiIkonuIgre(igra.ID).subscribe(res => this.otvoriSliku(igra, res));
			}
		});
	}
	private otvoriSliku(igra: Igra, fajl: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			igra.ikona = reader.result;
		}, false);

		if (fajl)
			reader.readAsDataURL(fajl);
	}

	skroluj(): void
	{
		let url = this.router.url;
		let urlSplit = url.split('/');
		let page = urlSplit[1];

		const config: ScrollToConfigOptions = {
			target: 'login'
		};

		if (page == '' || page == 'signup')
		{
			this.korisnikService.activate = undefined;
			this._scrollToService.scrollTo(config);
		}
		else
			this.router.navigate(['']);
	}

	odjaviKorisnika()
	{
		this.authService.logOut();
		this.isLogged = this.authService.loginCheck().success;

		if (!this.isLogged)
		{
			location.reload();

		}
	}

	public proveriLog()
	{
		this.isLogged = this.authService.loginCheck().success;
		if (this.isLogged == true)
		{
			this.user = this.authService.loginCheck().user;
		}
	}

	promeniJezik(jezik: string)
	{
		this.translate.use(jezik);

		this.izabraniJezik = jezik; // za prikaz u meniju (en/sr)

		if (this.isLogged == true)
			this.user.jezik = jezik;

		if (this.isLogged)
			this.korisnikService.azurirajJezik(this.user.ID, this.izabraniJezik).subscribe();
	}

	vratiUrlZaProfil(): string
	{
		return "/profil/" + this.user.username;
	}

	vratiUrlZaPodesavanjeProfila(): string
	{
		return this.vratiUrlZaProfil() + "/detalji";
	}

	filtrirajIgre(): void
	{
		this.igre = this.sveIgre.filter(x => x.naziv.toLowerCase().indexOf(this.igrePretraga.toLowerCase()) >= 0);
	}

	ukloniPretragu(): void
	{
		this.igrePretraga = "";
		this.igre = this.sveIgre;
	}

	prikaziNotifkaciju(ID: number)
	{
		this.izabranaNotifikacija = this.notifikacije.find(x => x.ID == ID);
		this.izabranaNotifikacija.procitana = 'true';
		this.korisnikService.procitajNotifikaciju(this.izabranaNotifikacija.ID).subscribe();
		this.imaNovihNotifikacija = this.notifikacije.some(x => x.procitana == 'false');

		$("#Modal").modal('show');
	}
}
