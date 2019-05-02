import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servisi/auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { KorisnikService } from '../../../servisi/korisnik.service';

@Component({
	selector: 'app-detalji-profila',
	templateUrl: './detalji-profila.component.html',
	styleUrls: ['./detalji-profila.component.css']
})
export class DetaljiProfilaComponent implements OnInit
{
	korisnik: Korisnik;
	porukaOAzuriranju: string;

	trenutniPassword: string = "";
	noviPassword1: string = "";
	noviPassword2: string = "";
	email: string = "";

	readonly regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
	readonly regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

	//provera da slucajno ne dodje preko url-a do detalja korisnika
	gledaSvojProfil: boolean;

	constructor(
		private authService: AuthService,
		private router: Router,
		private korisnikService: KorisnikService
	) { }

	ngOnInit()
	{
		if (this.authService.loginCheck().success == false)
			this.router.navigate(['']);
		else
			this.korisnik = this.authService.loginCheck().user;
	}

	prikaziGresku(poruka): void
	{
		this.porukaOAzuriranju = poruka;
		$("#poruka").removeClass('alert-success');
		$("#poruka").addClass('alert-danger');
		$("#poruka").hide().show();
	}

	azurirajPodatke(): void
	{
		if (this.trenutniPassword == "" && this.email == "")
			this.prikaziGresku("PROFILE_PAGE.UPDATE_EMPTY");
		else if (this.noviPassword1 != this.noviPassword2)
			this.prikaziGresku("PASSWORD_DONT_MACTH");
		else if (this.trenutniPassword != "" && this.regexPassword.test(this.noviPassword1) == false)
			this.prikaziGresku("PASSWORD_CHECK");
		else if (this.email != "" && this.regexEmail.test(this.email) == false)
			this.prikaziGresku("BAD_EMAIL");
		else
		{
			this.korisnikService.azurirajPodatke(this.korisnik.ID, this.trenutniPassword, this.noviPassword1, this.email).subscribe((res: any) =>
			{
				if (res.success)
				{
					if (res.stariPass == false)
						this.prikaziGresku("WRONG_CURRENT_PASSWORD");
					else
					{
						this.porukaOAzuriranju = "PROFILE_PAGE.UPDATE_SUCCESS";
						$("#poruka").removeClass('alert-danger');
						$("#poruka").addClass('alert-success');

						this.trenutniPassword = this.noviPassword1 = this.noviPassword2 = this.email = "";
					}
				}
				else
					this.prikaziGresku("PROFILE_PAGE.UPDATE_FAIL");

				$("#poruka").hide().show();
			});
		}
	}

	sakrijAlert(): void
	{
		$("#poruka").hide();
	}
}
