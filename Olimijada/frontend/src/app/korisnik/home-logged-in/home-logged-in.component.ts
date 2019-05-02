import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servisi/auth.service';
import { Router } from '@angular/router';
import { IgraService } from '../../servisi/igra.service';
import { KorisnikService } from '../../servisi/korisnik.service';
import { TurnirService } from '../../servisi/turnir.service';
import { TimoviService } from '../../servisi/timovi.service';

@Component({
	selector: 'app-home-logged-in',
	templateUrl: './home-logged-in.component.html',
	styleUrls: ['./home-logged-in.component.css'],
	providers: [AuthService, IgraService, KorisnikService, TurnirService]
})
export class HomeLoggedInComponent implements OnInit
{
	botovi: Bot[] = []; //najbolji botovi korisnik
	turniri: any[] = []; //turniri u najavi
	prijavljeniTurniri: any[] = [];
	posledjiMecevi: any[] = [];
	korisnik: Korisnik;
	mecevi: any[];

	constructor(private authService: AuthService,
		private router: Router,
		private igraService: IgraService,
		private korisnikService: KorisnikService,
		private turniriService: TurnirService,
		private timoviService: TimoviService)
	{
	}

	ngOnInit()
	{
		if (this.authService.loginCheck().success)
		{
			this.korisnik = this.authService.loginCheck().user;
			this.korisnikService.vratiNajboljeBotoveKorisnika(this.korisnik.ID).subscribe((items: any) =>
			{
				this.botovi = items;
			});
			this.turniriService.vratiTurnireUNajavi().subscribe((items: any) =>
			{
				this.turniri = items.turniri;
			});
			this.turniriService.vratiTurnireNaKojeSuPrijavljeniTimoviKorisnika(this.korisnik.ID).subscribe((res: any) =>
			{
				this.prijavljeniTurniri = res.turniri;

			});

			this.korisnikService.vratiMeceveKorisnika(this.korisnik.ID).subscribe((res: any) =>
			{
				if (res.success == true)
				{
					this.mecevi = res.meceviKorisnika;

					for (let mec of this.mecevi)
					{
						this.timoviService.vratiTim(mec.idTima1).subscribe((res1: any) =>
						{
							if (res1.success == true)
							{
								this.timoviService.vratiTim(mec.idTima2).subscribe((res2: any) =>
								{
									if (res2.success)
									{
										const nazivTima1 = res1.tim.naziv;
										const nazivTima2 = res2.tim.naziv;

										if (nazivTima1 != "" && nazivTima2 != "")
										{
											var pom = { _id: mec._id, nazivTima1: nazivTima1, nazivTima2: nazivTima2, poeniTima1: mec.poeniTima1, poeniTima2: mec.poeniTima2, pocetakMeca: mec.pocetakMeca, zavrsen: mec.zavrsen };
											this.posledjiMecevi.push(pom);
										}
									}
								});
							}
						});
					}
				}
			});
		}
		else
		{
			this.router.navigate[("")];
		}
	}

}
