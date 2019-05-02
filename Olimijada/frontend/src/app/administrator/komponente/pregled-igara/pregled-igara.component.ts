import { Component, OnInit } from '@angular/core';
import { IgraService } from '../../../servisi/igra.service';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../../servisi/admin.service';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { UploadService } from '../../../servisi/upload.service';

@Component({
	selector: 'app-pregled-igara',
	templateUrl: './pregled-igara.component.html',
	styleUrls: ['./pregled-igara.component.css']
})
export class PregledIgaraComponent implements OnInit
{
	// flag koji sluzi za to da li se dodaje igra ili se pregledaju igre i taj fleg setuju odgovarajuce funkcije klikom na duge
	dodavanjeIgre: boolean = false;

	porurkaOBrisanjuIgre: string;
	porukaOAzuriranjuIgre: string;

	uploadSlika: any;
	uploadIkona: any;
	uploadPozadina: any;

	izabranaSlika: File;
	izabranaIkona: File;


	sveIgre: Igra[];
	izabranaIgra: Igra = null;

	constructor(
		private igraService: IgraService,
		private adminService: AdminService,
		private _scrollToService: ScrollToService,
		private uploadService: UploadService,
	) { }

	ngOnInit()
	{
		this.vratiSveIgre();
	}

	private vratiSveIgre(): void
	{
		this.igraService.vratiSveIgre().subscribe((res: any) =>
		{
			this.sveIgre = res;
		});
	}

	postaviFormuZaDodavanjeIgara(): void
	{
		this.dodavanjeIgre = true;
	}

	postaviTabeleIgara(): void
	{
		this.dodavanjeIgre = false;
	}

	obrisiIgru(idIgre): void
	{
		this.adminService.obrisiIgru(idIgre).subscribe((res: any) =>
		{
			if (res.success == true)
			{
				this.porurkaOBrisanjuIgre = "ADMIN_PAGE.DELETE_GAME_SUCCESS";
				$('#porukaOBrisanjuIgre').removeClass('alert-danger');
				$('#porukaOBrisanjuIgre').addClass('alert-success');

				this.vratiSveIgre();
			}
			else
			{
				this.porurkaOBrisanjuIgre = "ADMIN_PAGE.DELETE_GAME_FAIL";
				$('#porukaOBrisanjuIgre').removeClass('alert-success');
				$('#porukaOBrisanjuIgre').addClass('alert-danger');
			}

			$("#porukaOBrisanjuIgre").hide().show();
		});
	}

	sakrijAlert(id): void
	{
		$(`#${id}`).hide();
	}

	izaberiIgruZaIzmenu(idIgre): void
	{
		$('#porukaOUspesnomAzuriranjuIgre').hide();
		let prethodnaIgra = this.izabranaIgra;
		this.izabranaIgra = this.sveIgre.find(x => x.ID == idIgre);
		this.igraService.vratiSlikuIgre(this.izabranaIgra.ID).subscribe((res: Blob) =>
		{
			if (res.type == "image/png" || res.type == "image/jpeg")
			{
				this.napraviSlikuIgreOdBloba(res);
			}
		});
		this.igraService.vratiIkonuIgre(this.izabranaIgra.ID).subscribe((res: Blob) =>
		{
			if (res.type == "image/png" || res.type == "image/jpeg")
			{
				this.napraviIkonuIgreOdBloba(res);
			}
		});
		this.igraService.vratiPozadinuIgre(this.izabranaIgra.ID).subscribe((res: Blob) =>
		{
			if (res.type == "image/png" || res.type == "image/jpeg")
			{
				this.napraviPozadinuIgreOdBloba(res);
			}
		});

		if (prethodnaIgra == null)
			setTimeout(this.skroluj.bind(null, this._scrollToService), 300); // mali delay koji sluzi da se forma stvarno prikaze, zbog skrola
		else
			this.skroluj(this._scrollToService);

	}

	private skroluj(scrollToService): void
	{
		scrollToService.scrollTo({ target: "azuriranjeIgre" });
	}

	prikaziUploadovanuSliku(event): void
	{
		//this.uploadSlika = $("#uploadSlike").prop('files')[0];
		this.izabranaIgra.slika = <File>event.target.files[0];
		this.uploadSlika = this.izabranaIgra.slika;
		if (this.uploadSlika != undefined)
		{
			this.uploadService.uploadSlikeIgre(this.izabranaIgra.ID, this.uploadSlika).subscribe();

			var oFReader = new FileReader();
			oFReader.readAsDataURL(this.izabranaIgra.slika);
			oFReader.onload = function (oFREvent)
			{
				$("#uploadSlika").attr('src', oFReader.result);
			}
		}
	}

	prikaziUploadovanuIkonu(event): void
	{
		//this.uploadIkona = $("#uploadIkone").prop('files')[0];
		this.izabranaIgra.ikona = <File>event.target.files[0];
		this.uploadIkona = this.izabranaIgra.ikona;

		if (this.uploadIkona != undefined)
		{
			this.uploadService.uploadIkoneIgre(this.izabranaIgra.ID, this.uploadIkona).subscribe();
			var oFReader = new FileReader();
			oFReader.readAsDataURL(this.izabranaIgra.ikona);
			oFReader.onload = function (oFREvent)
			{
				//$("#uploadIkonaText").css('display', 'none');
				$("#uploadIkona").attr('src', oFReader.result);
			}
		}
	}

	prikaziUploadovanuPozadinu(event): void
	{
		//this.uploadPozadina = $("#uploadPozadine").prop('files')[0];
		this.izabranaIgra.pozadina = <File>event.target.files[0];
		this.uploadPozadina = this.izabranaIgra.pozadina;

		if (this.uploadPozadina != undefined)
		{
			this.uploadService.uploadPozadineIgre(this.izabranaIgra.ID, this.uploadPozadina).subscribe();

			var oFReader = new FileReader();
			oFReader.readAsDataURL(this.izabranaIgra.pozadina);

			oFReader.onload = function (oFREvent)
			{
				//$("#uploadPozadinaText").css('display', 'none');
				$("#uploadPozadina").attr('src', oFReader.result);
			}
		}
	}

	ponistiIzmene(): void
	{
		this.izabranaIgra = null;
	}

	private prikaziGreskuPriAzuriranjuIgre(poruka: string): void 
	{
		this.porukaOAzuriranjuIgre = poruka;
		$('#porukaOUspesnomAzuriranjuIgre').hide();
		$('#porukaOAzuriranjuIgre').addClass('alert-danger');
		$('#porukaOAzuriranjuIgre').hide().show();
	}

	azurirajIgru(frm): void
	{
		if (!frm.valid)
			this.prikaziGreskuPriAzuriranjuIgre("ADMIN_PAGE.FILL_FORM");
		if (this.izabranaIgra.minBrojTimovaUMecu > this.izabranaIgra.maxBrojTimovaUMecu)
			this.prikaziGreskuPriAzuriranjuIgre("ADMIN_PAGE.MAX_TEAM_FAIL");
		else if (this.izabranaIgra.minBrojIgracaUTimu > this.izabranaIgra.maxBrojIgracaUTimu)
			this.prikaziGreskuPriAzuriranjuIgre("ADMIN_PAGE.MAX_PLAYERS_FAIL");
		else
		{
			this.adminService.azurirajIgru(this.izabranaIgra).subscribe((res: any) =>
			{
				if (res.success)
				{
					this.izabranaIgra = null;
					this.porukaOAzuriranjuIgre = "ADMIN_PAGE.UPDATE_GAME_SUCCESS";
					$('#porukaOUspesnomAzuriranjuIgre').addClass('alert-success');
					$('#porukaOUspesnomAzuriranjuIgre').hide().show();
				}
				else
					this.prikaziGreskuPriAzuriranjuIgre("ADMIN_PAGE.UPDATE_GAME_FAIL");
			});
		}
	}

	napraviSlikuIgreOdBloba(slika: Blob): void
	{

		let reader = new FileReader();

		reader.addEventListener("load", () =>
		{
			this.uploadSlika = reader.result;
		}, false);

		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

	napraviIkonuIgreOdBloba(slika: Blob): void
	{
		let reader = new FileReader();

		reader.addEventListener("load", () =>
		{
			this.uploadIkona = reader.result;
		}, false);

		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

	napraviPozadinuIgreOdBloba(slika: Blob): void
	{
		let reader = new FileReader();

		reader.addEventListener("load", () =>
		{
			this.uploadPozadina = reader.result;
		}, false);

		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

}
