import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servisi/auth.service';
import { Router } from '@angular/router';
import { KorisnikService } from '../../servisi/korisnik.service';
import { UploadService } from '../../servisi/upload.service';
declare var $: any;

@Component({
	selector: 'app-strana-profila',
	templateUrl: './strana-profila.component.html',
	styleUrls: ['./strana-profila.component.css']
})
export class StranaProfilaComponent implements OnInit
{
	rankPoeni: number;
	nivo: number;
	username: string;
	daLiPostoji: boolean; //profil sa trazenim username
	isLogged: boolean; //da li je ulogovan 
	gledaSvojProfil: boolean;
	profilnaSlika: any = "../../assets/images/user-2-icon.png";
	private idKorisnika: any;
	private izabranaSlika: File;

	constructor(
		private authService: AuthService,
		private router: Router,
		private korisnikService: KorisnikService,
		private uploadServis: UploadService
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
		this.sakrijAlert();
		/*
		Provera da li je korisnik ulogovan, jer strani profila 
		ne moze pristupiti korisnik koji nije ulogovan
		*/
		let login = this.authService.loginCheck();
		let usernameKorisnikaKojiGleda;

		if (login.success)
			usernameKorisnikaKojiGleda = login.user.username;
			
		let url = this.router.url;
		let usernameUrl = url.split('/');
		let usernameKorisnikaProfila = usernameUrl[2];

		if (usernameKorisnikaKojiGleda == usernameKorisnikaProfila)
		{
			//ako gleda svoj profil
			this.daLiPostoji = true;
			this.gledaSvojProfil = true;
			this.username = usernameKorisnikaKojiGleda;
			this.korisnikService.vratiKorisnika(this.username).subscribe((res: any) =>
			{
				if (res.korisnik == undefined)
				{
					this.daLiPostoji = false;
				}
				else
				{
					this.idKorisnika = res.korisnik.ID;
					this.korisnikService.vratiProfilnuSliku(this.idKorisnika).subscribe(res => this.napraviSlikuOdBloba(res));
					this.korisnikService.vratiRankPoeneKorisnika(this.idKorisnika).subscribe((res: any) =>
					{
						if (res.success)
						{
							this.rankPoeni = res.rankPoeni % 100;
							this.nivo = Math.floor(res.rankPoeni / 100) + 1;
						}
					});
				}
			});
		}
		else
		{
			//ako gleda tudj
			this.username = usernameKorisnikaProfila;
			this.gledaSvojProfil = false;
			this.korisnikService.vratiKorisnika(usernameKorisnikaProfila).subscribe((res: any) =>
			{
				if (res.korisnik == undefined)
				{
					this.daLiPostoji = false;
				}
				else
				{
					this.daLiPostoji = true;
					this.idKorisnika = res.korisnik.ID;
					this.korisnikService.vratiProfilnuSliku(this.idKorisnika).subscribe(res => this.napraviSlikuOdBloba(res));
					this.korisnikService.vratiRankPoeneKorisnika(this.idKorisnika).subscribe((res: any) =>
					{
						if (res.success)
						{
							this.rankPoeni = res.rankPoeni;
							this.nivo = Math.floor(this.rankPoeni / 100) + 1;
						}
					});
				}
			});

		}
	}

	sakrijAlert()
	{
		$("#losFajl").hide();
	}

	onFileChanged(event)
	{
		this.izabranaSlika = <File>event.target.files[0];
		this.uploadSlike();
	}

	uploadSlike()
	{
		var odgovor: any;
		if (this.izabranaSlika != null)
		{
			this.uploadServis.uploadProfilneSlike(this.idKorisnika, this.izabranaSlika).subscribe(res =>
			{
				odgovor = res;
				if (odgovor.success)
				{
					this.korisnikService.vratiProfilnuSliku(this.idKorisnika).subscribe(res => this.napraviSlikuOdBloba(res));
				}
				else
				{
					$('#losFajl').hide().show();
				}
			});
		}
	}

	napraviSlikuOdBloba(slika: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			this.profilnaSlika = reader.result;
		}, false);
		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

	/*
	prikaziDugmeZaUpload(event)
	{
		$("#uploadSlike").removeClass("fade-out");
		$("#uploadSlike").addClass("fade-in");
	}

	sakrijDugmeZaUpload(event)
	{
		$("#uploadSlike").removeClass("fade-in");
		$("#uploadSlike").addClass("fade-out");
	}
	*/
}
