import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { TurnirService } from "../../servisi/turnir.service";
declare var $: any;
import { ParamMap, Router, ActivatedRoute } from '@angular/router';

import { TimoviUTakmicenju } from "../../klase/timoviUTakmicenju";
import { contours } from 'd3';

@Component({
	selector: 'app-rang-lista-turnira',
	templateUrl: './rang-lista-turnira.component.html',
	styleUrls: ['./rang-lista-turnira.component.css']
})

export class RangListaTurniraComponent implements OnInit
{
	turnir: Turnir;

	idTurnira: number;
	nazivTurnira: string = "";
	nazivIgre: string = "";
	rangLista: TimoviUTakmicenju[] = [];
	datumKraja: Date;

	@ViewChild('content') content: ElementRef;

	constructor(private turnirService: TurnirService, private route: ActivatedRoute) { }

	ngOnInit()
	{
		this.idTurnira = this.route.snapshot.params.id;
		this.turnirService.vratiTurnir(this.idTurnira).subscribe((res: any) =>
		{
			if (res.success == true)
			{
				this.turnir = res.turnir;
				this.podaciOturniru();
			}

		});
	}

	podaciOturniru(): any
	{
		if (this.turnir != undefined) 
		{
			
			if (this.turnir.tipTurnira == 1)
			{
				this.turnir.ucesnici.forEach(tim =>
				{
					this.rangLista.push(new TimoviUTakmicenju(tim.idTima, tim.nazivTima, tim.idKorisnika, tim.username));
				});

				this.turnir.kolo.forEach(kolo =>
				{
					kolo.mecevi.forEach(mec =>
					{
						if (mec.poeniTima1 > mec.poeniTima2)
						{
							var tim = this.rangLista.find(x => x.ID == mec.idTima1);
							var tim2 = this.rangLista.find(x => x.ID == mec.idTima2);

							tim.brojPoena += 3;
							tim.brojPobeda++;

							tim2.brojPoraza++;
						}
						else if (mec.poeniTima1 < mec.poeniTima2)
						{
							var tim = this.rangLista.find(x => x.ID == mec.idTima1);
							var tim2 = this.rangLista.find(x => x.ID == mec.idTima2);

							tim.brojPoraza++;

							tim2.brojPoena += 3;
							tim2.brojPobeda++;
						}
						else
						{
							var tim = this.rangLista.find(x => x.ID == mec.idTima1);
							var tim2 = this.rangLista.find(x => x.ID == mec.idTima2);

							tim.brojPoena++;
							tim.brojNeresenih++;

							tim2.brojNeresenih++;
							tim2.brojPoena++;
						}
					});
				});
			}
			else
			{
				
				var kolo = this.turnir.kolo.find(x => x.brojKola == 1);
				
				if (kolo != undefined)
				{
					var mec = kolo.mecevi[0];
					
					this.turnir.ucesnici.forEach(tim =>
					{
						
						if (tim.idTima == mec.idTima1 || tim.idTima == mec.idTima2)
							this.rangLista.push(new TimoviUTakmicenju(tim.idTima, tim.nazivTima, tim.idKorisnika, tim.username));
							
					});
					
					if (mec.poeniTima1 > mec.poeniTima2)
						this.rangLista.find(x => x.ID == mec.idTima1).brojPoena++;
					else
						this.rangLista.find(x => x.ID == mec.idTima2).brojPoena++;
				}
			}

			this.rangLista.sort((x1, x2) => x2.brojPoena - x1.brojPoena);
			for (let i = 0; i < this.rangLista.length; i++)
				this.rangLista[i].pozicija = i + 1;
		}
	}

	public pdfDownload()
	{

		var A4_width = 595; //pixels
		var A4_height = 842; //, { scale: 5 }
		var scale = 2;
		var naziv = this.nazivTurnira;
		html2canvas(document.getElementById('content'), { scale: scale }).then(function (canvas)
		{


			var image = canvas.toDataURL("image/png");
			//canvas.getContext('2d').mozImageSmoothingEnabled = true;
			canvas.getContext('2d').imageSmoothingEnabled = true;
			//mozImageSmoothingEnabled

			var height = canvas.height;
			height = height / (6 * scale);
			var width = canvas.width;
			width = width / (6 * scale);
			var doc = new jsPDF({
				orientation: 'landscape',
				unit: 'mm',
				format: [width, height],
				compressPdf: true
			})
			doc.addImage(image, "PNG", 0, 0, width, height, undefined, 'FAST');
			doc.save(naziv + ".pdf");
		});
	}

}
