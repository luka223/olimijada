import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

@Injectable()
export class IgraService
{
	public sveIgre: Observable<Igra[]>;

	constructor(private httpClient: HttpClient) { }

	// status utakmice (u toku, u najavi...)
	vratiStatusTurniraZaIgru(idIgre)
	{			
		return this.httpClient.post(environment.backendRuta + 'mongo/vratiTurnireIgre', { idIgre: idIgre });
	}

	vratiOpisIgre(idIgre)
	{
		return this.httpClient.post(environment.backendRuta + 'select/igraOpis', { idIgre: idIgre });
	}

	vratiSveIgreSortiraneGlobalno()
	{
		return this.httpClient.post(environment.backendRuta + 'select/sveIgreSortiraneGlobalno', {});
	}

	vratiSveIgre()
	{
		return this.httpClient.post(environment.backendRuta + 'select/sveIgre', {});
	}
	vratiIgruZaId(id:number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiIgruZaId`, { idIgre: id });
	}

	vratiNajpopularnijeIgre()
	{
		return this.httpClient.post(environment.backendRuta + 'select/vratiNajpopualrnijeIgre', {});
	}

	vratiNajboljeTimoveZaOdredjenuIgru(idIgre)
	{
		return this.httpClient.post(environment.backendRuta + 'select/najboljiTimovi', { idIgre: idIgre });
	}

	vratiIgruPoNazivu(nazivIgre) 
	{
		if(nazivIgre!=undefined) nazivIgre= nazivIgre.replace(/%20/g, ' ');
		return this.httpClient.post(environment.backendRuta + `select/vratiIgruPoNazivu`, { nazivIgre: nazivIgre });
	}

	vratiSlikuIgre(idIgre: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiSlikuIgre/${idIgre}`, { responseType: 'blob' });
	}
	vratiPozadinuIgre(idIgre: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiPozadinuIgre/${idIgre}`, { responseType: 'blob' });
	}
	vratiIkonuIgre(idIgre: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiIkonuIgre/${idIgre}`, { responseType: 'blob' });
	}

	//za stranu igre meceve da pokupi
	vratiPoslednjih10UtakmicaZaIgru(idIgre: number)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiPoslednjeUtakmice`, { idIgre: idIgre });
	}
}
