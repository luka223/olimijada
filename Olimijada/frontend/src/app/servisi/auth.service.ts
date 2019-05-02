import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import "rxjs/add/operator/map";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { environment } from '../../environments/environment';

import { SessionStorageService } from 'ngx-webstorage';
import * as decode from 'jwt-decode';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';

@Injectable()
export class AuthService
{
	user: Korisnik;

	constructor(
		private http: Http,
		private platformLocation: PlatformLocation,
		private router: Router,
		private adminService: AdminService
	) { }

	registrujKorisnika(user)
	{
		var headers = new Headers();
		headers.append("Content-Type", "application/json");

		return this.http.post(environment.backendRuta + "registracija", user, { headers: headers }).map(res => res.json());
	}

	loginKorisnika(user)
	{
		var headers = new Headers();
		headers.append("Content-Type", "application/json");

		return this.http.post(environment.backendRuta + "login", user, { headers: headers })
			.map(res => res.json());
	}

	loginCheck()
	{
		var token = localStorage.getItem('currentUser')
		if (token != null)
		{
			const tokenPayload = decode(token);
			return { success: true, user: tokenPayload.user };

		}

		return { success: false, user: "" };

	}

	adminCheck()
	{
		this.adminService.proveriToken().subscribe();

		var token = localStorage.getItem('currentAdmin');
		if (token != null)
		{
			const tokenPayload = decode(token);


			return { success: true, user: tokenPayload.user };

		}

		return { success: false, user: "" };

	}


	logOut()
	{
		if (localStorage.getItem('currentUser') != null)
		{
			localStorage.removeItem('currentUser');
		}
		this.router.navigate(['/']);


	}

	logOutAdmin()
	{
		if (localStorage.getItem('currentAdmin') != null)
		{
			localStorage.removeItem('currentAdmin');
		}
		this.router.navigate(['/adminsignin']);
	}
}
