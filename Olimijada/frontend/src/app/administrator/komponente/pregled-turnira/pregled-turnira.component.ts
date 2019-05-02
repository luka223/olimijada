import { Component, OnInit } from '@angular/core';
import { TurnirService } from '../../../servisi/turnir.service';
import { AdminService } from '../../../servisi/admin.service';

@Component({
	selector: 'app-pregled-turnira',
	templateUrl: './pregled-turnira.component.html',
	styleUrls: ['./pregled-turnira.component.css']
})
export class PregledTurniraComponent implements OnInit
{
	turniri: Turnir[];
	dodavanjeTurnira: boolean; // flag koji oznacava da li se dodaje turnir ili se prikazuje spisak turnira
	porukaOBrisanjuTurnira: string;

	constructor(
		private adminService: AdminService,
		private turnirService: TurnirService
	) { }

	ngOnInit()
	{
		this.dodavanjeTurnira = false;
		this.vratiTurnire();
	}

	vratiTurnire(): void
	{
		this.turnirService.vratiTurnireUNajavi().subscribe((res: any) =>
		{
			this.turniri = res.turniri;
		});
	}

	obrisiTurnir(idTurnira): void
	{
		this.adminService.obrisiTurnir(idTurnira).subscribe((res: any) =>
		{
			if (res.success == true)
			{
				this.porukaOBrisanjuTurnira = "ADMIN_PAGE.DELETE_TOURNAMENT_SUCCESS";
				$('#porukaOBrisanjuTurnira').removeClass('alert-danger');
				$('#porukaOBrisanjuTurnira').addClass('alert-success');

				this.vratiTurnire();
			}
			else
			{
				this.porukaOBrisanjuTurnira = "ADMIN_PAGE.DELETE_TOURNAMENT_FAIL";
				$('#porukaOBrisanjuTurnira').removeClass('alert-success');
				$('#porukaOBrisanjuTurnira').addClass('alert-danger');
			}

			$("#porukaOBrisanjuTurnira").hide().show();
		});
	}

	postaviFormuZaDodavanjeTurnira(): void
	{
		this.dodavanjeTurnira = true;
	}

	postaviTabeluTurnira(): void
	{
		this.dodavanjeTurnira = false;
	}

	sakrijAlert(): void
	{
		$('#porukaOBrisanjuTurnira').hide();
	}
}
