import { Component, OnInit, OnDestroy } from '@angular/core';
import { VizuelizacijaMecaComponent } from './vizuelizacija-meca/vizuelizacija-meca.component';
import { TimoviService } from '../../servisi/timovi.service';
import { MecService } from '../../servisi/mec.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
@Component({
	selector: 'app-strana-meca',
	templateUrl: './strana-meca.component.html',
	styleUrls: ['./strana-meca.component.css'],
	providers: [TimoviService, MecService]
})

export class StranaMecaComponent implements OnInit, OnDestroy
{

	idTima1: number;
	idTima2: number;
	nazivTima1: string;
	nazivTima2: string;
	grbTima1: any;
	grbTima2: any;
	rezultat: any;
	rezultatTima1: number = 0;
	rezultatTima2: number = 0;
	timerTeam1: any;
	timerTeam2: any;

	idMeca: any;

	constructor(
		private timoviServis: TimoviService,
		private mecServis: MecService,
		private router: Router,
		private _translateService: TranslateService
	) { }

	ngOnInit()
	{
		this.statistikaLabele = ["", "", ""];

		// da se pri promeni jezika promene labele
		// onDefaultLangChange mora zbog prvog ucitavanja (tada se vuce defaultLang, svaka promena posle radi onLangeChange)
		this._translateService.onDefaultLangChange.subscribe((event) => this.postaviLabeleZaGrafik());
		this._translateService.onLangChange.subscribe((event) => this.postaviLabeleZaGrafik());

		let url = this.router.url;
		let idUrl = url.split('/');
		this.idMeca = idUrl[2];
		this.mecServis.vratiMec(this.idMeca).subscribe(res => this.pokupiPodatkeOUtakmici(res));
	}

	private postaviLabeleZaGrafik()
	{
		this.statistikaLabele = [
			this._translateService.instant("PROFILE_PAGE.STATISTICS.WINS"),
			this._translateService.instant("PROFILE_PAGE.STATISTICS.DRAWS"),
			this._translateService.instant("PROFILE_PAGE.STATISTICS.LOSES")
		];
	}

	getRandomIntInclusive(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}

	pokupiPodatkeOUtakmici(res: any): void
	{
		this.idTima1 = res.mec.idTima1;
		this.idTima2 = res.mec.idTima2;
		this.timoviServis.vratiGrbTima(this.idTima1).subscribe(res => this.napraviSlikuOdBloba(res, 1));
		this.timoviServis.vratiGrbTima(this.idTima2).subscribe(res => this.napraviSlikuOdBloba(res, 2));
		this.rezultatChange(res.mec.poeniTima1, res.mec.poeniTima2);

		this.pokupiPodatkeOTimovima(this.idTima1, this.idTima2);
	}

	rezultatChange(brPoenaTima1: number, brPoenaTima2: number)
	{

		var time = 32000;
		var intervalPrvogTima = (time - 2000) / brPoenaTima1;
		var intervalDrugogTima = (time - 2000) / brPoenaTima2;

		var i = brPoenaTima1;
		var j = 0;

		this.timerTeam1 = setInterval(function ()
		{
			if (j <= i)
			{

				++j;
				$("#rez1").html(j);


			}
			else { clearInterval(this.timerTeam1); $("#rez1").html(i); }
		}, intervalPrvogTima - 100)

		setTimeout(() => { clearInterval(this.timerTeam1) }, time - 1000);

		var i2 = brPoenaTima2;
		var j2 = 0;
		this.timerTeam2 = setInterval(function ()
		{
			if (j2 <= i2)
			{
				++j2;
				$("#rez2").html(j2);

			}

			else { clearInterval(this.timerTeam2); $("#rez2").html(i2) };
		}, intervalDrugogTima - 100)

		setTimeout(() => { clearInterval(this.timerTeam2) }, time - 1000);

	}
	ngOnDestroy(): void
	{
		clearInterval(this.timerTeam1);
		clearInterval(this.timerTeam2);
	}

	pokupiPodatkeOTimovima(id1: number, id2: number): void
	{
		this.timoviServis.vratiTim(id1).subscribe((res: any) =>
		{
			if (res.success)
			{
				if (res.tim != null)
				{
					this.nazivTima1 = res.tim.naziv;
					let brNeresenih = res.tim.brojMeceva - res.tim.brojPobeda - res.tim.brojPoraza;
					this.statistikaTima1 = [res.tim.brojPobeda, brNeresenih, res.tim.brojPoraza];
				}
			}
		});

		this.timoviServis.vratiTim(id2).subscribe((res: any) =>
		{
			if (res.success)
			{
				if (res.tim != null)
				{
					this.nazivTima2 = res.tim.naziv;
					let brNeresenih = res.tim.brojMeceva - res.tim.brojPobeda - res.tim.brojPoraza;
					this.statistikaTima2 = [res.tim.brojPobeda, brNeresenih, res.tim.brojPoraza];
				}
			}
		});
	}

	napraviSlikuOdBloba(slika: Blob, id: number): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			if (id === 1)
			{
				this.grbTima1 = reader.result;
				//this.grbTima1 = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
			}
			if (id === 2)
			{
				this.grbTima2 = reader.result;
				//this.grbTima2 = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
			}
		}, false);
		if (slika)
		{
			reader.readAsDataURL(slika);
		}
	}

	// promenljive i metode za pitu (grafik)
	public statistikaLabele: string[];
	//  = [
	// 	this._translateService.instant("PROFILE_PAGE.STATISTICS.WINS"),
	// 	this._translateService.instant("PROFILE_PAGE.STATISTICS.DRAWS"),
	// 	this._translateService.instant("PROFILE_PAGE.STATISTICS.LOSES")
	// ];

	public bojeGrafika = [{ backgroundColor: ['rgb(66, 134, 244)', 'rgb(86, 196, 88)', 'rgb(209, 120, 98)'] }];

	// public statistikaTima1: number[] = [3, 5, 2];
	public statistikaTima1: number[];
	public statistikaTima2: number[];
	public doughnutChartType: string = 'doughnut';

}
