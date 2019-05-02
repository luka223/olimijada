import { UploadService } from './../../../servisi/upload.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { AdminService } from '../../../servisi/admin.service';
import { IgraService } from '../../../servisi/igra.service';
import { DataService } from '../../../servisi/data.service';

@Component({
	selector: 'app-dodavanje-igre',
	templateUrl: './dodavanje-igre.component.html',
	styleUrls: ['./dodavanje-igre.component.css']
})
export class DodavanjeIgreComponent implements OnInit
{
	constructor(private adminService: AdminService, private uploadService: UploadService, private igraService: IgraService,private dataService:DataService) { }

	naziv = '';
	minBrojTimova = '';
	maxBrojTimova = '';
	opis = '';
	description = '';
	slika = '';
	ikona = '';
	pozadina = '';
	minBrojIgraca;
	maxBrojIgraca;
	greskaTim = false;
	greskaIgraci = false;
	izabranaSlika: File = null;
	izabranaIkona: File = null;
	izabranaPozadina: File = null;

	uploadovanaSlikaIgre: File = null;
	readonly uploadSlika: string = environment.rutaDoSlika + 'upload.png';

	uploadovanaIkonaIgre: File = null;
	readonly uploadIkona: string = environment.rutaDoSlika + 'upload.png';

	uploadovanaPozadinaIgre: File = null;
	readonly uploadPozadina: string = environment.rutaDoSlika + 'upload.png';

	greskaMaxTim = '';
	greskaMaxIgrac = '';
	maxIDIgre;

	poruka = '';

	ngOnInit()
	{
		this.adminService.proveriToken().subscribe();
	}

	prikaziGresku(poruka)
	{
		this.poruka = poruka;
		$('#poruka').removeClass('alert-success');
		$('#poruka').addClass('alert-danger');
		$("#poruka").hide().show();
	}

	dodajIgru(frm)
	{
		/*let ikona = 'uploads/ikoneIgara/' + this.uploadovanaIkonaIgre.name;
		let slika = 'uploads/slikeIgara/' + this.uploadovanaSlikaIgre.name;
		let pozadina = 'uploads/pozadineIgara/' + this.uploadovanaPozadinaIgre.name;*/
		if (!frm.valid)
			this.prikaziGresku("ADMIN_PAGE.FILL_FORM");
		if (this.minBrojTimova > this.maxBrojTimova)
			this.prikaziGresku("ADMIN_PAGE.MAX_TEAM_FAIL");
		else if (this.minBrojIgraca > this.maxBrojIgraca)
			this.prikaziGresku("ADMIN_PAGE.MAX_PLAYERS_FAIL");
		else
		{
			this.adminService.dodajIgru(this.maxIDIgre, frm.value.naziv, frm.value.minBrojTimova, frm.value.maxBrojTimova, frm.value.opis, frm.value.description, frm.value.minBrojIgraca, frm.value.maxBrojIgraca)
				.subscribe((items: any) =>
				{
					if (items.success === true)
					{
						this.poruka = 'ADMIN_PAGE.GAME_ADDED';
						$('#poruka').removeClass('alert-danger');
						$('#poruka').addClass('alert-success');
						let id = items.id;

						this.uploadService.uploadSlikeIgre(id, this.izabranaSlika).subscribe(res =>
						{
							//console.log(res, "slika");
						});

						this.uploadService.uploadIkoneIgre(id, this.izabranaIkona).subscribe(res =>
						{
							// console.log(res, "ikona");
						})

						this.uploadService.uploadPozadineIgre(id, this.izabranaPozadina).subscribe(res =>
						{
							// console.log(res);
						});

						this.uploadovanaSlikaIgre = null;
						this.uploadovanaIkonaIgre = null;
						this.uploadovanaPozadinaIgre = null;

						$("#uploadSlika").attr('src', this.uploadSlika);
						$("#uploadText").css('display', 'inline');

						$("#uploadIkona").attr('src', this.uploadSlika);
						$("#uploadIkonaText").css('display', 'inline');

						$("#uploadPozadina").attr('src', this.uploadSlika);
						$("#uploadPozadinaText").css('display', 'inline');
						
						frm.reset();
						this.dataService.newIgraAdd(true);

					}
					else
					{
						this.prikaziGresku('ADMIN_PAGE.GAME_FAILED');
					}

					$('#poruka').hide().show();
				})
		}
	}

	prikaziUploadovanuSliku(event): void
	{
		this.uploadovanaSlikaIgre = $("#uploadSlike").prop('files')[0];
		this.izabranaSlika = <File>event.target.files[0];

		var oFReader = new FileReader();
		oFReader.readAsDataURL(this.uploadovanaSlikaIgre);
		oFReader.onload = function (oFREvent)
		{
			$("#uploadText").css('display', 'none');
			$("#uploadSlika").attr('src', oFReader.result);
		};
	};

	prikaziUploadovanuIkonu(event): void
	{
		this.uploadovanaIkonaIgre = $("#uploadIkone").prop('files')[0];
		this.izabranaIkona = <File>event.target.files[0];

		var oFReader = new FileReader();
		oFReader.readAsDataURL(this.uploadovanaIkonaIgre);
		oFReader.onload = function (oFREvent)
		{
			$("#uploadIkonaText").css('display', 'none');
			$("#uploadIkona").attr('src', oFReader.result);
		};
	};

	prikaziUploadovanuPozadinu(event): void
	{
		this.uploadovanaPozadinaIgre = $("#uploadPozadine").prop('files')[0];
		this.izabranaPozadina = <File>event.target.files[0];

		var oFReader = new FileReader();
		oFReader.readAsDataURL(this.uploadovanaIkonaIgre);
		oFReader.onload = function (oFREvent)
		{
			$("#uploadPozadinaText").css('display', 'none');
			$("#uploadPozadina").attr('src', oFReader.result);
		};
		/*
			this.uploadService.uploadPozadineIgre(8, this.izabranaPozadina)
			  .subscribe((items: any) => {
			   // console.log(items);
			  });
		
		*/

		var oFReader = new FileReader();
		oFReader.readAsDataURL(this.uploadovanaPozadinaIgre);

		oFReader.onload = function (oFREvent)
		{
			$("#uploadPozadinaText").css('display', 'none');
			$("#uploadPozadina").attr('id', "prikazUploadaPozadina");
			$("#prikazUploadaPozadina").attr('src', oFReader.result);
		};
	};

	sakrijAlert(): void
	{
		$('#poruka').hide();
	}

}
