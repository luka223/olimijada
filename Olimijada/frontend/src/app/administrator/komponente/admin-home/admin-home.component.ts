import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../servisi/admin.service';
import { AuthService } from '../../../servisi/auth.service';
import { Router } from '@angular/router';
import * as decode from 'jwt-decode';
declare var $: any;

@Component({
	selector: 'app-admin-home',
	templateUrl: './admin-home.component.html',
	styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
	tokenUser: string;
	tokenAdmin: string;
	korisnik: string;


	constructor(
		private adminService: AdminService,
		private authService: AuthService,
		private router: Router
	) {

	}

	ngOnInit() {
		this.adminService.proveriToken().subscribe();
	}

	otvoriPopUpZaMejlSvi() {
		$("#posaljiMejlSvima").modal({
			backdrop: 'static',
			show: true
		});
	}

	zatvoriPopUpZaMejlSvi() {
		$("#uspesnoPoslatMejl").hide();
		$("#posaljiMejlSvima").modal('hide');
		$("#naslovMejlaSvi").val("");
		$("#sadrzajMejlaSvi").val("");
	}

	posaljiMejlSvima() {
		var naslov = $("#naslovMejlaSvi").val();
		var tekst = $("#sadrzajMejlaSvi").val();
		var mejl = "<pre>" + tekst + "</pre>";

		this.adminService.posaljiMejlSvimKorisicima(naslov, mejl).subscribe((res: any) => {
			if (res.success) {
				$("#uspesnoPoslatMejlSvi").show();
			}
		});
	}

	otvoriModalZaLogout() {
		
		this.tokenUser = localStorage.getItem('currentUser');
		this.tokenAdmin = localStorage.getItem('currentAdmin');

		if(this.tokenUser !== null )
		{
			this.korisnik = decode(this.tokenUser).user.username;
		}
		
		if (this.tokenUser !== null && decode(this.tokenUser).user.username === decode(this.tokenAdmin).user.username) {
			
			this.router.navigate(['']);
		}
		else {
			$("#modalLogoutAdmin").modal({
				backdrop: 'static',
				show: true
			});
		}

	}

	odjavaAdmina() {
		if(localStorage.getItem('currentUser') !== null)
		{
			this.authService.logOut();
		}
		
		localStorage.setItem('currentUser', localStorage.getItem('currentAdmin'));

		this.router.navigate(['']);
		location.reload();

	}

	logOutAdmin() {
		this.authService.logOutAdmin();
	}

}
