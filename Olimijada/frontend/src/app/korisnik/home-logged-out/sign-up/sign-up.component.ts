import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servisi/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PlatformLocation } from '@angular/common';
import { KorisnikService } from '../../../servisi/korisnik.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit
{
	username: string = "";
	password: string = "";
	password1: string = "";
	email: string = "";
	captcha: string;

	successSignUp: boolean = false;

	// konstante za prikaz poruka o lose popunjenim podacima
	readonly warning_pass: string = "PASSWORD_CHECK";
	readonly warning_user: string = "USERNAME_CHECK";
	readonly warning_same_pass: string = "PASS_MATCH";
	readonly warning: string = "";
	readonly warningEmail: string = "BAD_EMAIL";

	usernameCheck: string = "";
	passwordCheck: string = "";
	emailCheck: string = "";
	samePass: string = "";
	captchaFail: boolean = false;
	odgovor: string = "";

	constructor(
		private authService: AuthService,
		private router: Router,
		private _cookieService: CookieService,
		private location: PlatformLocation,
		private korisnikService: KorisnikService
	) { }

	ngOnInit()
	{
	}

	resolved(captchaResponse: string)
	{
		this.captcha = captchaResponse;
		this.captchaFail = false;
	}

	usernameCheckF(): boolean
	{
		var re = /^[A-ZŠĐČĆŽa-zšđčćž0-9_.\\-]{6,12}$/;
		var odogovor = re.test(this.username);
		var tacka_zarez = (this.username).indexOf(";");
	
		if (odogovor == false || tacka_zarez > -1)
		{
			this.usernameCheck = this.warning_user;
			return false;
		}
		else
		{
			this.usernameCheck = "";
			return true;
		}
	}
	resendMail()
	{
		this.korisnikService.resendMail(this.username).subscribe((data: any) =>
		{
			if (data.success ==true)	
			{
				$("#resend").hide();
			}

		});
	}
	passwordCheckF(): boolean
	{
		var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$.!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
		var odogovor = re.test(this.password);
	
		if (odogovor == false)
		{
			this.passwordCheck = this.warning_pass;
			return false;
		}
		else
		{
			this.passwordCheck = "";

			if (this.password1 != "")
				return this.passwordCheck1F(); // ako je vec uneo dole, da uporedi da li se poklapaju

			return true;
		}
	}

	passwordCheck1F(): boolean
	{
		if (this.password1 != this.password) 
		{
			this.samePass = this.warning_same_pass;
			return false;
		}
		else
		{
			this.samePass = "";
			return true;
		}
	}

	emailCheckF(): boolean
	{
		var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		var odogovor = re.test(this.email);

		if (odogovor == false)
		{
			this.emailCheck = this.warningEmail;
			return false;
		}
		else
		{
			this.emailCheck = "";
			return true;
		}
	}

	registrujSe()
	{
		if (this.usernameCheckF() && this.passwordCheckF() && this.passwordCheck1F() && this.emailCheckF())
		{
			var user = { username: this.username, password: this.password, email: this.email, address: (this.location as any).location.origin, recaptcha: this.captcha };

			this.authService.registrujKorisnika(user).subscribe(data =>
			{
				if (data.success)
				{
					this.successSignUp = true;
				}
				else
				{
					if (data.captchaFail == true)
						this.captchaFail = true;
					else if (data.userTaken == true)
						this.odgovor = "USER_TAKEN";
					else if (data.emailTaken == true)
						this.odgovor = "EMAIL_TAKEN";
					else
						this.odgovor = "REG_FAIL"
				}
			});
		}
	}
}
