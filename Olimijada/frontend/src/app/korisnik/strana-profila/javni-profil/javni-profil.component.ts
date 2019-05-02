import { Component, OnInit } from '@angular/core';
import { TimoviService } from '../../../servisi/timovi.service';
import { AuthService } from '../../../servisi/auth.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TurnirService } from '../../../servisi/turnir.service';
import { KorisnikService } from '../../../servisi/korisnik.service';
import { BotoviService } from '../../../servisi/botovi.service';

@Component({
	selector: 'app-javni-profil',
	templateUrl: './javni-profil.component.html',
	styleUrls: ['./javni-profil.component.css'],
	providers: [TimoviService, AuthService, TurnirService]
})
export class JavniProfilComponent implements OnInit
{
	private idKorisnika: number;
	private usernameKorisnikaProfila: string;
	private usernameKorisnikaKojiGleda: string;
	private korisnikProfil: any;

	username: string;
	gledaSvojProfil: boolean;
	timovi: Tim[] = [];
	turniri: any[] = [];
	botovi: Bot[] = [];

	timStat = {
		naziv: "",
		brOdigranihMeceva: 0,
		brPobeda: 0,
		brPoraza: 0,
		brNeresenih: 0
	};

	constructor(private timoviServis: TimoviService,
		private turnirServis: TurnirService,
		private korisnikServis: KorisnikService,
		private authServis: AuthService,
		private botoviServis: BotoviService,
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
		let login = this.authServis.loginCheck();
		if (login.success == true)
			this.usernameKorisnikaKojiGleda = login.user.username;
			
		let urlUsername = this.router.url;
		let username = urlUsername.split('/');
		this.usernameKorisnikaProfila = username[2];

		if (this.usernameKorisnikaKojiGleda == this.usernameKorisnikaProfila)
		{
			this.gledaSvojProfil = true;
			this.username = this.usernameKorisnikaKojiGleda;
			this.prikaziTurnireNaKojeJePrijavljen(login.user.ID);
		}
		else
		{
			this.gledaSvojProfil = false;
			this.username = this.usernameKorisnikaProfila;
			this.prikaziPodatkePosetiocu();
		}
	}

	prikaziPodatkePosetiocu()
	{
		this.turniri = [];
		this.korisnikServis.vratiKorisnika(this.usernameKorisnikaProfila).subscribe((res: any) =>
		{
			if (res.success = true)
			{
				this.korisnikProfil = res.korisnik;
				let idProfila = this.korisnikProfil.ID;
				this.prikaziTimove(idProfila);
				this.prikaziTurnireNaKojeJePrijavljen(idProfila);
				this.prikaziBotove(idProfila);
			}
		});
	}

	prikaziBotove(id: number): void
	{
		this.botoviServis.pokupiBotove(id).subscribe((res: any) => this.botovi = res);
	}

	prikaziTimove(id: number): void
	{
		this.timoviServis.pokupiTimove(id).subscribe((res: any) => this.timovi = res);
	}

	prikaziTurnireNaKojeJePrijavljen(id: number): void
	{
		this.turnirServis.vratiTurnireNaKojeSuPrijavljeniTimoviKorisnika(id).subscribe((res: any) =>
		{
			this.turniri = res.turniri;
		});
	}

	prikaziStatistiku(idTima: number): void
	{
		var tim;
		this.timStat.naziv = "";
		this.timStat.brOdigranihMeceva = 0;
		this.timStat.brPobeda = 0;
		this.timStat.brPoraza = 0;
		this.timStat.brNeresenih = 0;

		tim = this.timovi.find(tim => tim.ID == idTima);

		this.timStat.naziv = tim.naziv;
		this.timStat.brOdigranihMeceva = tim.brojMeceva;
		this.timStat.brPobeda = tim.brojPobeda;
		this.timStat.brPoraza = tim.brojPoraza;
		this.timStat.brNeresenih = tim.brojMeceva - tim.brojPobeda - tim.brojPoraza;

	}

}
