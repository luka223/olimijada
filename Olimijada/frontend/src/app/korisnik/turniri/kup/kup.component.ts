import { Component, OnInit } from '@angular/core';
import { TurnirService } from '../../../servisi/turnir.service';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { TimoviService } from '../../../servisi/timovi.service';

@Component({
	selector: 'app-kup',
	templateUrl: './kup.component.html',
	styleUrls: ['./kup.component.css']
})
export class KupComponent implements OnInit
{
	id: string;
	idTurnira: string;
	turnir: any;
	jesteKup: boolean;

	constructor(private turnirService: TurnirService,
		private route: ActivatedRoute,
		private location: PlatformLocation,
		private timoviService: TimoviService
	) { }

	ngOnInit()
	{
		this.id = this.route.snapshot.params.id;
		this.idTurnira = this.route.snapshot.params.id;
		this.pokupiPodatke();
	}

	pokupiPodatke()
	{
		this.turnirService.vratiTurnir(this.idTurnira).subscribe((res: any) =>
		{
			if (res.success)
			{
				this.turnir = res.turnir;
				if (res.turnir.tipTurnira == 2)
				{
					this.jesteKup = true;
					(this.turnir.kolo).forEach(kolo =>
					{
						(kolo.mecevi).forEach(mec =>
						{
							mec.nazivTima1 = this.vratiImeTima(mec.idTima1);
							mec.nazivTima2 = this.vratiImeTima(mec.idTima2);
						});
					});
				}
				else
				{
					this.jesteKup = false;
				}

			}
		});
	}

	vratiImeTima(idTima): string
	{
		var nazivTima: string = "";
		this.turnir.ucesnici.forEach(ucesnik =>
		{
			if (ucesnik.idTima == idTima)
			{
				nazivTima = ucesnik.nazivTima;
			}
		});

		return nazivTima;
	}

	podesiPozicijuGrafa()
	{

	}


	//za oblik linija d3.shape curve
	/*curve = shape.curveStep;
	draggingEnabled = false;
	width: number = 700;
	height: number = 300;
	fitContainer: boolean = false;
	autoZoom: boolean = true;
	panOnZoom: boolean = false;
	enableZoom: boolean = false;
	autoCenter: boolean = true;
	showLegend = true;
	*/
	//orientation: string = 'LR'; // LR, RL, TB, BT
	/*	hierarchialGraph = {
			nodes: [
				{
					id: 'start',
					label: 'nazivTima1',
	
				},
				{
					id: '1',
					label: 'nazivTima1',
				},
				{
					id: '2.1',
					label: 'nazivTima1',
				},
				{
					id: '2.2',
					label: 'nazivTima2'
				},
				{
					id: '3.1',
					label: 'nazivTima1',
				},
				{
					id: '3.2',
					label: 'nazivTima4',
				},
				{
					id: '3.3',
					label: 'nazivTima2',
				},
				{
					id: '3.4',
					label: 'nazivTima3',
				}
			],
			links: [
				{
					source: 'start',
					target: '1'
				},
				{
					source: '1',
					target: '2.1'
				},
				{
					source: '1',
					target: '2.2'
				},
				{
					source: '2.1',
					target: '3.1'
				},
				{
					source: '2.1',
					target: '3.2'
				},
				{
					source: '2.2',
					target: '3.3'
				},
				{
					source: '2.2',
					target: '3.4'
				}
			]
		}
	
		/*
		hierarchialGraph = {
			nodes: [
				{
					id: 'start',
					label: 'start'
				}, {
					id: '1',
					label: 'Query ThreatConnect',
				}, {
					id: '2',
					label: 'Query XForce',
				}, {
					id: '3',
					label: 'Format Results'
				}, {
					id: '4',
					label: 'Search Splunk'
				}, {
					id: '5',
					label: 'Block LDAP'
				}, {
					id: '6',
					label: 'Email Results'
				}
			],
			links: [
				{
					source: 'start',
					target: '1',
					label: 'links to'
				}, {
					source: 'start',
					target: '2'
				}, {
					source: '1',
					target: '3',
					label: 'related to'
				}, {
					source: '2',
					target: '4'
				}, {
					source: '2',
					target: '6'
				}, {
					source: '3',
					target: '5'
				}
			]
		}
		*/
}
