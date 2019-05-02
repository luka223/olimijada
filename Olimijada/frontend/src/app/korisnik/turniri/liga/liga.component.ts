import { Component, OnInit } from '@angular/core';
import { TurnirService } from '../../../servisi/turnir.service';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { TimoviService } from '../../../servisi/timovi.service';
declare var $: any;

@Component({
	selector: 'app-liga',
	templateUrl: './liga.component.html',
	styleUrls: ['./liga.component.css']
})

export class LigaComponent implements OnInit
{
	id: string;
	idTurnira: string;
	turnir: any;
	jesteLiga: boolean;

	constructor(private turnirService: TurnirService,
		private route: ActivatedRoute,
		private location: PlatformLocation,
		private timoviService: TimoviService
	) { }

	ngOnInit()
	{
		this.id = this.route.snapshot.params.id;
		this.idTurnira = this.route.snapshot.params.id;
		this.pokupiPodatkeOLigi();
	}

	pokupiPodatkeOLigi()
	{
		this.turnirService.vratiTurnir(this.idTurnira).subscribe((res: any) =>
		{
			if (res.success)
			{
				this.turnir = res.turnir;
				if (res.turnir.tipTurnira == 1)
				{
					this.jesteLiga = true;
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
					this.jesteLiga = false;
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
}
