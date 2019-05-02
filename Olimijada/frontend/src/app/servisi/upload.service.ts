import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UploadService
{
	maxID ;
	constructor(private httpClient: HttpClient) { }

	uploadProfilneSlike(idKorisnika: number, slika: File)
	{
		var fd = new FormData();
		fd.append('profilna', slika, slika.name);
		return this.httpClient.post(environment.backendRuta + 'upload/profilna/' + idKorisnika, fd);
	}

	uploadBota(idKorisnika: number, nazivBota: string, idIgre: number, bot: File)
	{
		var fd = new FormData();
		fd.append('bot', bot, bot.name);
		return this.httpClient.post(environment.backendRuta + `upload/dodajBota/${idKorisnika}&${nazivBota}&${idIgre}`, fd);
	}

	uploadGrba(idTima: number, grb: File)
	{
		var fd = new FormData();
		fd.append('grb', grb, grb.name);
		return this.httpClient.post(environment.backendRuta + `upload/postaviGrb/${idTima}`, fd);
	}

	uploadSlikeIgre(idIgre, slikaIgre: File)
	{
		var fd = new  FormData();
		fd.append('slikaigre', slikaIgre, slikaIgre.name);
		return this.httpClient.post(environment.backendRuta + `upload/slikaIgre/${idIgre}`, fd);
	}

	uploadIkoneIgre(idIgre, ikonaIgre: File)
	{
		var fd = new  FormData();
		fd.append('ikonaigre', ikonaIgre, ikonaIgre.name);
		return this.httpClient.post(environment.backendRuta + `upload/ikonaIgre/${idIgre}`, fd);
	}

	uploadPozadineIgre(idIgre, pozadinaIgre: File)
	{
		var fd = new  FormData();
		fd.append('pozadinaigre', pozadinaIgre, pozadinaIgre.name);
		return this.httpClient.post(environment.backendRuta + `upload/pozadinaIgre/${idIgre}`, fd, {});
	}
}
