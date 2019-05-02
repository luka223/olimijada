import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servisi/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageService } from 'ngx-webstorage';
import { KorisnikService } from "../../../servisi/korisnik.service"
declare var $: any;

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit
{
	
	badInputs: string;
	username: string = "";
	password: string = "";
	poruka: string = "";
	user: string = "";

	injection: string = "";
	odgovor2: string = "";
	zapamtime: boolean = false;

	zaboravljenaSifraBoolean: boolean = false;
	email: string = "";
	email_check: string = "";
	warningEmail: string = "BAD_EMAIL";
	mailSendInput:boolean=false;
	greska:string="";
	id: number;
	code: number;	warning_pass: string = "PASSWORD_CHECK";
	warning_same_pass: string = "PASS_MATCH";
	password_check:string="";
	same_pass:string="";
	password1:string;
	password2:string;
	
	codeInput:number;

	code_msg:string="";
	codePost:string="HOMEPAGE.WROGN_CODE";

	end:boolean=false;
	end_promenjena:string="";
	constructor(
		private authService: AuthService,
		private router: Router,
		private _cookieService: CookieService,
		public korisnikService: KorisnikService,
		private sessionSt: SessionStorageService,
	) { }

	ngOnInit()
	{
	}

	popuniHtml()
	{
		this.zaboravljenaSifraBoolean = true;

	}

	codeCheck()
	{
		if(this.code!=this.codeInput)
		{
			this.code_msg=this.codePost;
		}
		else {
			this.code_msg="";
		}
	}

	Promeni(){

		if(this.password1=="" || this.password2=="" || this.codeInput==undefined || this.code_msg!="" || this.same_pass!="")
		{
			this.badInputs="HOMEPAGE.BAD_INPUT";
		}
		else {
				this.korisnikService.promeniSifru(this.id,this.password1).subscribe((data: any) =>
				{
					this.end=true;
					if(data.success==true)
						this.end_promenjena="HOMEPAGE.PASSWORD_CHANGED";
					else this.end_promenjena="HOMEPAGE.ERROR_PASSWORD_CHANGE";



				})
		}



	}
	emailCheck(): boolean
	{
		var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		var odogovor = re.test(this.email);

		if (odogovor == true)
		{
			this.email_check = "";
			return true;
		}
		else
		{
			this.email_check = this.warningEmail;
			return false;
		}
	}

	passwordCheck(): boolean
	{
		var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
		var odogovor = re.test(this.password1);

		if (odogovor == false)
		{
			this.password_check = this.warning_pass;
			return true;
		}
		else
		{
			this.password_check = "";
			return false;
		}
	}

	passwordCheck1(): boolean
	{
		if (this.password1 == this.password2) 
		{
			this.same_pass = "";
			return true;
		}
		else
		{
			this.same_pass = this.warning_same_pass;
			return false;
		}
	}


	resendMail()
	{
		this.korisnikService.resendMail(this.username).subscribe((data: any) =>
		{
			if (data.success == false)	
			{
				
			}

		});
	}

	sendMail()
	{
		this.korisnikService.slanjeKodaZaboravljenaSifra(this.email).subscribe((data:any)=>{
			if(data.success==true)
			{
				this.mailSendInput=true;
				this.code=data.code;
				this.id=data.id;
			}
			else {
					this.greska=data.msg;
			}
		});
	}


	ulogujSe(): void
	{
		var user = { username: this.username, password: this.password };
		var tackaZarezUsername = (user.username).indexOf(";");
		var tackaZarezPassword = (user.password).indexOf(";");

		if (tackaZarezPassword == -1 && tackaZarezUsername == -1 && this.username != "" && this.password != "") 
		{
			this.authService.loginKorisnika(user).subscribe(data => 
			{
				if (data.success)
				{


					if (data.user.potvrdjen == "true")
					{

						var token = data.token;
						var userCookie = false;
						
						//ne koristi se !!! remeber me !!!
						
						if (this.zapamtime)
							userCookie = true;
						
						var cookieUser = JSON.stringify({ remember: userCookie });
						this._cookieService.set("remember", cookieUser);
////////////////////////////////////////////////////////////////////////////////////////////
						localStorage.setItem("currentUser", token);
						$("#za_kraj_prijave").html('');
						location.reload();
					}
					else
					{
						this.korisnikService.activate = false;
					}

				}
				else
					this.poruka = data.msg;

			});
		}
		else
		{
			this.injection = "INJECTION";
		}
	}
}
