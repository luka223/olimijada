import { Component, OnInit } from '@angular/core';
import { IgraService } from '../../servisi/igra.service';
import { AuthService } from '../../servisi/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageService } from 'ngx-webstorage';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
	selector: 'app-home-logged-out',
	templateUrl: './home-logged-out.component.html',
	styleUrls: ['./home-logged-out.component.css'],
	providers: [IgraService]
})

export class HomeLoggedOutComponent implements OnInit
{
	opisNaslov = "DESCRIPTION";
	opisAplikacije = "HOMEPAGE.DESCRIPTION";
	igre: Igra[];

	constructor(
		private igraService: IgraService,
		private authService: AuthService,
		private router: Router,
		private domSanatizer: DomSanitizer
	) { }

	ngOnInit()
	{
		if (this.authService.loginCheck().success)
			this.router.navigate(["/home"]);
	}

	scroll()
	{
	}
}
