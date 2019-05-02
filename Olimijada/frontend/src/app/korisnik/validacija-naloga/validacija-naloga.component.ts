import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KorisnikService } from '../../servisi/korisnik.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-validacija-naloga',
  templateUrl: './validacija-naloga.component.html',
  styleUrls: ['./validacija-naloga.component.css']
})
export class ValidacijaNalogaComponent implements OnInit {


	constructor(private route:ActivatedRoute,private korisnikService:KorisnikService,private location:PlatformLocation) { }



	validnost:boolean=false;
	address=(this.location as any).location.origin;



  ngOnInit() {

	this.route.queryParams.subscribe(params=>{
		if(params['kode'])
		{
			var pom=params['kode'];
			this.korisnikService.aktivirajKorisnika(pom).subscribe((data:any) =>
			{
				if(data.success==true)
				{
					this.validnost=true;

				} 
			});
			
		}	
	})

  }

}
