import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TurnirService
{
	constructor(private httpClient: HttpClient) { }

	vratiTipoveTurnira()
	{
		return this.httpClient.post(environment.backendRuta + 'select/vratiTipoveTurnira', {});
	}

	// getTurniriNajava
	vratiTurnireUNajavi()
	{
		// succes i turniri
		return this.httpClient.post(environment.backendRuta + 'mongo/vratiTurnireUNajavi', {});
	}

	//zavrseni mecevi turnira
	vratiZavrseneMeceveTurnira(id)
	{
		// success i mecevi
		return this.httpClient.post(environment.backendRuta + 'mongo/vratiZavrseneMeceveTurnira', { idTurnira: id });
	}

	//mecevi u toku turnira
	vratiMeceveUTokuTurnira(id)
	{
		return this.httpClient.post(environment.backendRuta + 'mongo/vratiMeceveUTokuTurnira', { idTurnira: id });
	}

	//spisak prijavljenih timova
	vratiSpisakPrijavljenihTimova(id)
	{
		return this.httpClient.post(environment.backendRuta + 'mongo/spisakPrijavljenihTimova', { idTurnira: id });
	}

	//koristi se u javni-profil, vraca turnire u najavi na koje se prijavio korisnika sa nekim svojim timom
	vratiTurnireNaKojeSuPrijavljeniTimoviKorisnika(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiTurnireNaKojeSuPrijavljeniTimoviKorisnika`, { idKorisnika: idKorisnika });

		/*vraca naziv, datumPocetka, datumZavrsetka */
	}

	vratiTurnir(idTurnira)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiTurnir`, { idTurnira: idTurnira });
	}

	vratiTimoveIKorisnikeNaTurniru(idTurnira)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiTimoveIKorisnikeNaTurniru`, { idTurnira: idTurnira });
	}

	prijaviNaTurnir(idKorisnika: number, username: string, idTima: number, nazivTima: string, idTurnira: string): any
	{	/* 
		vraca success: true i vecPostoji: false ako je uspesno prijavljen, 
		vraca success: true i vecPostoji: true i tim sa kojim je prijavljen korisnik na takmicenje,
		vraca samo success: false ako je doslo do neke greske u bazi
		*/

		return this.httpClient.post(environment.backendRuta + `mongo/prijaviTimNaTurnir`, { idTurnira: idTurnira, idKorisnika: idKorisnika, username: username, idTima: idTima, nazivTima: nazivTima });
	}

	proveriDaLiJeVecPrijavljenNaTakmicenje(idKorisnika: number, idTurnira: string)
	{
		/*
		vraca success: false ako je doslo do greske u bazi, 
		success: true i vecPostoji: false ako je nije prijavljen
		success: true i vecPostoji: true i tim : rows[0] ako je prijvaljen i tim sa kojim je prijavljen
		*/

		return this.httpClient.post(environment.backendRuta + `mongo/vratiPrijavljenTimKorisnika`, { idTurnira: idTurnira, idKorisnika: idKorisnika });
	}

	proveriDaLiSuPopunjenaMestaNaTurniru(idTurnira: string)
	{
		/*vraca popunjenePrijave : true ako ne moze da se prijavi vise korisnika*/
		
		return this.httpClient.post(environment.backendRuta + `mongo/proveriDaLiJosUvekMozeDaSePrijaviNaTurnir`, { idTurnira: idTurnira });
	}
}
