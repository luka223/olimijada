import { TimoviService } from "../../../servisi/timovi.service";
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { pozicijaIgraca } from '../../../klase/pozicijaIgraca';
import { MecService } from "../../../servisi/mec.service";
import { DatePipe } from '@angular/common';
import * as createjs from 'createjs-module';
import { timer } from 'rxjs/observable/timer';
import { Player } from "../../../klase/Player";
import { IgraService } from "../../../servisi/igra.service";
import { getRandomString } from "selenium-webdriver/safari";
import { DataService } from "../../../servisi/data.service";

declare var $: any;

var w, h;
var players: Array<Player> = new Array<Player>();
var stage;
@Component({
	selector: 'app-test-tima',
	templateUrl: './test-tima.component.html',
	styleUrls: ['./test-tima.component.css']
})
export class TestTimaComponent implements OnInit
{
	saveTim: string;
	kraj: string = "";
	idProtivnika: any;
	grbTima1: any;
	grbTima2: any;
	sirina: any;
	visina: any;
	brIgraca: any;
	nazivPrvogTima: string = "";
	nazivDrugogTima: string = "";

	prikazTesta: boolean = false;

	username: string;
	rezultat: string = " 0:0 ";
	poeniTima1: number = 0;
	poeniTima2: number = 0;
	timoviProtivnika: any[] = [];
	timoviKorisnika: any[] = [];
	noTeams: string = "";
	noTeamBoolean: boolean = false;
	idIzabranogTima: number = undefined;
	izaberiProtivnickiTim: string = "";
	izaberiProtivnickiTimBoolean: boolean = false;
	idIgre: number = undefined;
	circle: any;
	pozadina: any;
	constructor(private route: ActivatedRoute, private timoviService: TimoviService, private igraService: IgraService, private dataService: DataService) { }

	ucitajTimove()
	{
		this.timoviService.vratiTimoveKorisnika(this.username).subscribe((data: any) =>
		{

			if (data.success == true)
			{

				this.noTeamBoolean = true;
				this.timoviKorisnika = data.timovi;

			}
			if (data.success == false || data.timovi.length == 0)
			{
				this.noTeamBoolean = false;
			}
		});
	}

	ngOnInit()
	{

		stage = new createjs.Stage("demoCanvas");
		this.username = this.route.snapshot.params.username;
		this.dataService.newTimChange.subscribe(flag =>
		{
			if (flag)
			{
				console.log(flag);
				this.ucitajTimove();
				this.dataService.newTimAdd(false);
			}
		})
		
		this.dataService.deleteTimChange.subscribe(flag =>
			{
				if (flag)
				{
					console.log(flag);
					this.ucitajTimove();
					this.dataService.newTimDelete(false);
				}
			})
			

		this.ucitajTimove();
	}
	getRandomIntInclusive(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}

	pokupiTim()
	{
		var idTima = undefined;
		idTima = $("#izaberiTimzaTestiranje option:selected").val();
		if (idTima != undefined)
		{
			this.izaberiProtivnickiTimBoolean = true;
			this.izaberiProtivnickiTim = "PROFILE_PAGE.TEST_TEAM.CHOOSE_OPPONENT";
			this.idIzabranogTima = idTima;


			for (var i = 0; i < this.timoviKorisnika.length; i++)
			{
				if (this.timoviKorisnika[i].idTima == this.idIzabranogTima)
				{
					this.nazivPrvogTima = this.timoviKorisnika[i].naziv;
					this.idIgre = this.timoviKorisnika[i].idIgre;
					console.log(this.idIgre);
					break;
				}
			}

			this.timoviProtivnika = this.timoviKorisnika.filter(x => x.idIgre == this.idIgre);

			this.brIgraca = this.timoviProtivnika[0].minBrojIgracaUTimu;

		}

	}
	private otvoriSliku(pozadina, fajl: Blob): void
	{
		let reader = new FileReader();
		reader.addEventListener("load", () =>
		{
			pozadina = reader.result;

		}, false);

		if (fajl)
			reader.readAsDataURL(fajl);
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

	testiraj()
	{
		var idTima2 = undefined;
		idTima2 = $("#izaberiProtivnika option:selected").val();

		if (idTima2 != undefined)
		{
			for (var i = 0; i < this.timoviProtivnika.length; i++)
			{
				if (this.timoviProtivnika[i].idTima == idTima2)
				{
					this.idProtivnika = this.timoviProtivnika[i].idTima;
					this.nazivDrugogTima = this.timoviProtivnika[i].naziv;
					break;
				}
			}

		}


		this.prikazTesta = true;
		$("#demoCanvas").show();


		$("#demoCanvas").css({ 'background-color': 'white', "border": "4px solid black" });


		this.timoviService.vratiGrbTima(this.idIzabranogTima).subscribe(res => this.napraviSlikuOdBloba(res, 1));
		this.timoviService.vratiGrbTima(this.idProtivnika).subscribe(res => this.napraviSlikuOdBloba(res, 2));



		this.sirina = $("#demoCanvas").width();
		this.visina = $("#demoCanvas").height();
		var br = 2 * this.brIgraca;
		for (let i = 0; i < br; i++)
		{
			players.push(new Player(this.sirina, this.visina, createjs, stage));
			players[i].setPosition(this.sirina / 2, this.visina / 2 + 40);
			if (i < this.brIgraca) players[i].addToCanvas("#A81515");
			else players[i].addToCanvas("#1554A8");
		}
		stage.update();
		this.stopAnimation();
		this.startTicker(br);

	}
	initCanvas()
	{
		w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


		(stage.canvas as HTMLCanvasElement).style.border = "1px solid black";
		if (w <= 768)
		{
			w = 1500;
			h = 800;
		}

		(stage.canvas as HTMLCanvasElement).width = w;
		(stage.canvas as HTMLCanvasElement).height = h;
	}
	startTicker(br)
	{

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", function ()
		{
			for (let i = 0; i < br; i++)
			{
				players[i].move();
			}
			stage.update();
		});
	}

	back()
	{
		this.prikazTesta = false;
		this.izaberiProtivnickiTimBoolean = false;
		$("#demoCanvas").hide();
	}

	stopAnimation()
	{

		let prikazTesta = this.prikazTesta;
		let izaberiProtivnickiTimBoolean = this.izaberiProtivnickiTimBoolean;
		let rezultat = this.getRandomIntInclusive(0, 2);

		if (rezultat == 0)
		{
			rezultat = "WIN";

			this.saveTim = this.nazivPrvogTima;
			var drugi = this.poeniTima2 = this.getRandomIntInclusive(1, 10);
			var prvi = this.poeniTima1 =  this.getRandomIntInclusive(1, 20);

			this.rezultat = "  " + prvi + ":" + drugi + "  ";

		}
		else if (rezultat == 1) 
		{
			rezultat = "WIN";
			this.saveTim = this.nazivDrugogTima;
			var prvi = this.poeniTima1 = this.getRandomIntInclusive(1, 10);
			var drugi = this.poeniTima2 = this.getRandomIntInclusive(1, 20);

			this.rezultat = "  " + prvi + ":" + drugi + "  ";

		}
		else
		{
			rezultat = "DRAW";

			var prvi = this.getRandomIntInclusive(1, 12);

			this.saveTim = "";

		}

		this.kraj = rezultat;

		setTimeout(function (prikazTesta, izaberiProtivnickiTimBoolean, rezultat, krajnjiRez)
		{
			prikazTesta = false;
			izaberiProtivnickiTimBoolean = false;

			$("#demoCanvas").hide();
			$("#kraj").show();


		}.bind(null, this.prikazTesta, this.izaberiProtivnickiTim, this.rezultat), 30000);

	}

	onResize(event)
	{
		this.sirina = event.target.innerWidth;
		this.visina = event.target.innerHeight;


	}


}
