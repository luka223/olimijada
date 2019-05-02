import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/observable';

@Injectable()
export class BotoviService
{
	constructor(private http: Http, private httpClient: HttpClient) { }

	pokupiBotove(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBotoveKorisnika`, { idKorisnika: idKorisnika });
	}

	dodajBota(idKorisnika: number, nazivBota: string, idIgre: number)
	{
		return this.httpClient.post(environment.backendRuta + `insert/dodajBota`, { idKorisnika: idKorisnika, nazivBota: nazivBota, idIgre: idIgre });
	}

	obrisiBota(idBota: number)
	{
		return this.httpClient.post(environment.backendRuta + `delete/obrisiBota`, { idBota: idBota });
	}

	vratiFajlBota(idBota: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiFajlBota/${idBota}`, { responseType: 'blob' });
	}

	azurirajFajlBota(idBota: number, sadrzaj: string)
	{
		return this.httpClient.post(environment.backendRuta + `update/azurirajFajl`, { idBota: idBota, kod: sadrzaj });
	}
}
