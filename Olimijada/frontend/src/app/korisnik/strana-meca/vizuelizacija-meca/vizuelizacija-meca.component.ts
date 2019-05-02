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

declare var $: any;

var w, h;
var players: Array<Player> = new Array<Player>();
var stage;

@Component({
	selector: 'app-vizuelizacija-meca',
	templateUrl: './vizuelizacija-meca.component.html',
	styleUrls: ['./vizuelizacija-meca.component.css'],

})



export class VizuelizacijaMecaComponent implements OnInit
{


	idIgre: any;
	brIgraca: number;
	sirina: any;
	visina: any;
	idMeca: number;




	constructor(private route: ActivatedRoute, private timoviService: TimoviService, private igraService: IgraService, private mecServis: MecService)
	{

	}

	ngOnInit()
	{
		this.idMeca = this.route.snapshot.params.id;
		stage = new createjs.Stage("demoCanvas");
		$("#demoCanvas").css({ 'background-color': 'white', "border": "4px solid black" });

		this.mecServis.vratiMec(this.idMeca).subscribe((data: any) =>
		{
			if (data.success)
			{
		this.idIgre =  data.idIgre;
		this.igraService.vratiIgruZaId(this.idIgre).subscribe((data: any) =>
		{
			if (data.success)
			{
				this.brIgraca = data.igra.minBrojIgracaUTimu;
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
		})
		}
		})


	}

	getRandomIntInclusive(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
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

	stopAnimation()
	{

		//	let prikazTesta = this.prikazTesta;
		//	let izaberiProtivnickiTimBoolean = this.izaberiProtivnickiTimBoolean;
		let rezultat = this.getRandomIntInclusive(0, 2);

		if (rezultat == 0)
		{
			rezultat = "WIN";

			//	this.saveTim=this.nazivPrvogTima;
			var drugi = this.getRandomIntInclusive(1, 10);
			var prvi = this.getRandomIntInclusive(1, 20);

			//	this.rezultat="  "+prvi+":"+drugi+"  ";

		}
		else if (rezultat == 1) 
		{
			rezultat = "WIN";
			//	this.saveTim=this.nazivDrugogTima;
			var prvi = this.getRandomIntInclusive(1, 10);
			var drugi = this.getRandomIntInclusive(1, 20);

			//	this.rezultat="  "+prvi+":"+drugi+"  ";

		}
		else
		{
			rezultat = "DRAW";

			var prvi = this.getRandomIntInclusive(1, 12);



		}

		//	this.kraj = rezultat;

		setTimeout(function (prikazTesta, izaberiProtivnickiTimBoolean, rezultat, krajnjiRez)
		{
			prikazTesta = false;
			izaberiProtivnickiTimBoolean = false;

			$("#demoCanvas").hide();
			$("#kraj").show();


		}.bind(null), 32000);

	}

	onResize(event)
	{
		this.sirina = event.target.innerWidth;
		this.visina = event.target.innerHeight;


	}

}







