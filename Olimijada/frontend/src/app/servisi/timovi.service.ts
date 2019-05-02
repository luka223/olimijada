import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/observable';

@Injectable()
export class TimoviService
{
	constructor(private httpClient: HttpClient) { }

	vratiTim(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiTim`, { idTima: idTima });
	}

	pokupiTimove(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiTimove`, { idKorisnika: idKorisnika });
	}

	pokupiBotoveTima(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBotoveTima`, { idTima: idTima });
	}

	obrisiBotaIzTima(idTima: number, idBota: number)
	{
		return this.httpClient.post(environment.backendRuta + 'delete/obrisiBotaIzTima', { idTima: idTima, idBota: idBota });
	}

	vratiGrbTima(idTima: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiGrbTima/${idTima}`, { responseType: 'blob' });
	}

	dodajTim(idKorisnika: number, idIgre: number, naziv: string)
	{
		return this.httpClient.post(environment.backendRuta + `insert/dodajTim`, { idKorisnika: idKorisnika, idIgre: idIgre, naziv: naziv });
	}

	dodajBotoveUTim(idTima: number, nizBotova: number[])
	{
		return this.httpClient.post(environment.backendRuta + `insert/dodajBotoveUTim`, { idTima: idTima, nizBotova: nizBotova });
	}

	pokupiUkupanBrojPoenaTimaKaoDomacina(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiUkupnePoeneTimaKaoDomacina`, { idTima: idTima });
	}

	pokupiUkupanBrojPoenaTimaKaoGosta(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiUkupnePoeneTimaKaoGosta`, { idTima: idTima });
	}

	pokupiBrojSvihOdigranihMecevaTima(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBrojOdigranihMecevaTima`, { idTima: idTima });
	}

	pokupiBrojPobedaTimaKaoDomacina(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBrojPobedaTimaKaoDomacina`, { idTima: idTima });
	}

	pokupiBrojPobedaTimaKaoGosta(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBrojPobedaTimaKaoGosta`, { idTima: idTima });
	}

	pokupiBrojNeresenihUtakmicaTima(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiBrojNeresenihUtakmicaTima`, { idTima: idTima });
	}

	// koristi se na profilnoj strani za brisanje tima
	obrisiTim(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `delete/obrisiTim`, { idTima: idTima });
	}

	//koristi se na strani meca
	pokupiNazivTima(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiNazivTima`, { idTima: idTima });
	}

	//za prijava-turnir(takmicenja) da pokupi timove samo za odredjenu igru  
	pokupiTimoveKorisnikaZaIgru(idKorisnika: number, idIgre: number, minRank: number, maxRank: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiTimoveKorisnikaZaIgru`, { idKorisnika: idKorisnika, idIgre: idIgre, minRank: minRank, maxRank: maxRank });
	}

	pokupiRankPoeneTima(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/izracunajRankPoeneZaTim`, { idTima: idTima });
	}

	vratiTimoveKorisnika(username: string)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiTimoveKorisnika`, { username: username });
	}

	vratiProtivnickeTimoveZaIgru(idTima: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiProtivnickeTimoveZaIgru`, { idTima: idTima });
	}
}
