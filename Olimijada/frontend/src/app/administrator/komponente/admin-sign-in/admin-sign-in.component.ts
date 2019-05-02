import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../servisi/admin.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-admin-sign-in',
	templateUrl: './admin-sign-in.component.html',
	styleUrls: ['./admin-sign-in.component.css']
})
export class AdminSignInComponent implements OnInit
{
	constructor(private adminService: AdminService, private router: Router) { }
	usernameAdmin: string = "";
	passwordAdmin: string = "";
	poruka: string = "";
	endMessage: string = "BAD_USERNAME_PASSWORD";


	ngOnInit()
	{
	}


	adminSignIn()
	{

		
		if (this.usernameAdmin != "" && this.passwordAdmin != "")
		{
			var tackaZarezUsername = (this.usernameAdmin).indexOf(";");
			var tackaZarezPassword = (this.passwordAdmin).indexOf(";");
			var razmakrezUsername = (this.usernameAdmin).indexOf(" ");
			var razmakZarezPassword = (this.passwordAdmin).indexOf(" ");


			if (tackaZarezPassword == -1 && tackaZarezUsername == -1 && razmakZarezPassword == -1 && razmakZarezPassword == -1)
			{
				
				this.adminService.adminSignIn(this.usernameAdmin, this.passwordAdmin).subscribe((data:any) =>
				{
					
					if (data.success)
					{


						if (data.user.potvrdjen == "true")
						{

							var token = data.token;
							localStorage.setItem("currentAdmin", token);
							this.router.navigate(['admin']);

						}
					}
					else
					{
						this.poruka = this.endMessage;
					}
				});
			}
			else
			{
				this.poruka = "SPACE_;"
			}
		}



	}

}
