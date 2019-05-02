import { Component, OnInit } from '@angular/core';
import { IgraService } from '../../servisi/igra.service';
import { AuthService } from '../../servisi/auth.service';
import { KorisnikService } from '../../servisi/korisnik.service';

@Component({
	selector: 'app-slajder',
	templateUrl: './slajder.component.html',
	styleUrls: ['./slajder.component.css']
})
export class SlajderComponent implements OnInit
{
	igre: Igra[];

	constructor(
		private igraService: IgraService,
		private authService: AuthService,
		private korisnikService: KorisnikService
	) { }

	ngOnInit()
	{
		let daLiJeUlogovan = this.authService.loginCheck().success;

		if (daLiJeUlogovan == true)
		{
			let idKorisnika = this.authService.loginCheck().user.ID;
			this.korisnikService.vratiPetIgaraKojeJeKorisnikNajviseIgrao(idKorisnika).subscribe((items:any) =>
			{
				this.igre = items;

				for (let igra of this.igre)
				{
					this.igraService.vratiSlikuIgre(igra.ID).subscribe(res => this.otvoriSliku(igra, res));
				}
			});
		}
		else
		{
			this.igraService.vratiNajpopularnijeIgre().subscribe((items:any) =>
			{
				this.igre = items;

				for (let igra of this.igre)
				{
					this.igraService.vratiSlikuIgre(igra.ID).subscribe(res => this.otvoriSliku(igra, res));
				}
			});
		}

	}

	private otvoriSliku(igra: Igra, fajl: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			igra.slika = reader.result;
		}, false);

		if (fajl)
			reader.readAsDataURL(fajl);
	}
}
