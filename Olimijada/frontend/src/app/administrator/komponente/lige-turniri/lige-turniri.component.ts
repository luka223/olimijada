import { Component, OnInit } from '@angular/core';
import { IgraService } from '../../../servisi/igra.service';
import { TurnirService } from '../../../servisi/turnir.service';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../servisi/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../servisi/admin.service';

@Component({
	selector: 'app-lige-turniri',
	templateUrl: './lige-turniri.component.html',
	styleUrls: ['./lige-turniri.component.css'],
	providers: [NgbAlertConfig]
})
export class LigeTurniriComponent implements OnInit
{
	sveIgre: Igra[] = [];
	tipoviTurnira: TipTurnira[];

	brojTimovaKup = [8, 16, 32];
	brojTimovaLiga: number[] = [];

	naziv: String = "";
	idTipaTurnira;
	idIgre: Number;
	brojTimova: Number;
	datumPocetak: string = "";
	vremePocetak: string = "";
	minRang: Number;
	maxRang: Number;

	poruka: String = "";

	constructor(
		private igraService: IgraService,
		private turnirService: TurnirService,
		private alertConfig: NgbAlertConfig,
		private authService: AuthService,
		private adminService: AdminService,
		private router: Router
	) { }


	ngOnInit()
	{
		this.adminService.proveriToken().subscribe();

		for (let i = 0; i <= 16; i++)
			this.brojTimovaLiga[i] = i + 4;

		this.igraService.vratiSveIgre().subscribe((items: any) =>
		{
			this.sveIgre = items;
		});

		this.turnirService.vratiTipoveTurnira().subscribe((res: any) =>
		{
			if (res.success)
				this.tipoviTurnira = res.tipovi;
		});
	}

	dodajTurnir()
	{
		if (this.proveraForme() == false)
		{
			$('#poruka').removeClass('alert-success');
			$('#poruka').addClass('alert-danger');
			$('#poruka').hide().show();
		}
		else 
		{
			let nazivIgre = $("#igra option:selected").html();

			this.adminService.dodajTurnir(this.naziv, this.idTipaTurnira, this.idIgre, nazivIgre, this.brojTimova, this.datumPocetak + 'T' + this.vremePocetak, this.minRang, this.maxRang).subscribe((res: any) =>
			{
				if (res.success === true)
				{
					this.poruka = 'ADMIN_PAGE.CREATED';
					$('#poruka').removeClass('alert-danger');
					$('#poruka').addClass('alert-success');
					this.resetujFormu();
				}
				else
				{
					this.poruka = 'ADMIN_PAGE.FAILED';
					$('#poruka').removeClass('alert-success');
					$('#poruka').addClass('alert-danger');
				}

				$('#poruka').hide().show();
			});
		}
	}

	proveraForme(): boolean
	{
		this.poruka = "";

		if (
			this.naziv == "" || this.idTipaTurnira == undefined || this.idIgre == undefined || this.brojTimova == undefined ||
			this.brojTimova == undefined || this.brojTimova == undefined || this.datumPocetak == "" || this.vremePocetak == "" ||
			this.minRang == undefined || this.maxRang == undefined
		)
			this.poruka = "ADMIN_PAGE.FILL_FORM";
		else if (new Date(this.datumPocetak + "T" + this.vremePocetak) < new Date())
			this.poruka = "ADMIN_PAGE.DATE_FAIL";
		else if (this.minRang > this.maxRang)
			this.poruka == "ADMIN_PAGE.RANG_FAIL";

		if (this.poruka == "")
			return true;
		else
			return false;
	}

	sakrijAlert(): void
	{
		$('#poruka').hide();
	}

	resetujFormu(): void
	{
		this.naziv = this.datumPocetak = this.vremePocetak = "";
		this.idTipaTurnira = this.idIgre = this.brojTimova = this.minRang = this.maxRang = undefined;
	}

	private dateToString(d: Date): string
	{
		let mesec = (d.getMonth() < 10)? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
		let dan = (d.getDate() < 10)? "0" + d.getDate() : d.getDate();
		
		return `${d.getFullYear()}-${mesec}-${dan}`;
	}

	proveriDatum(): void
	{
		let datumPocetak = new Date(this.datumPocetak);
		let danasnjiDatum = new Date();

		if (datumPocetak < danasnjiDatum)
			this.datumPocetak = this.dateToString(danasnjiDatum);

		if (this.vremePocetak != "")
			this.proveriVreme();
	}

	proveriVreme(): void
	{
		let datumPocetak = new Date(this.datumPocetak + " " + this.vremePocetak);
		let danasnjiDatum = new Date();

		if (datumPocetak < danasnjiDatum)
			this.vremePocetak = danasnjiDatum.toTimeString().slice(0, 5);;
	}
}
