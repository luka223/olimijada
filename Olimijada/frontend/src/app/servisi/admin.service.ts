import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlatformLocation } from '@angular/common';


@Injectable()
export class AdminService
{

	constructor(private http: Http, private location: PlatformLocation, private httpClient: HttpClient) { }

	adminSignIn(username, password)
	{

		var user = { username: username, password: password };

		return this.httpClient.post(environment.backendRuta + "admin/adminSignIn", { user: user });
	}

	proveriToken()
	{
		return this.httpClient.post(environment.backendRuta + 'admin/proveriToken', {});
	}

	vratiSveKorisnike()
	{//za admina
		const headers = new HttpHeaders()
			.set('Authorization', 'my-auth-token')
			.set('Content-Type', 'application/json');

		return this.httpClient.post(environment.backendRuta + `admin/vratiSveKorisnike/`, { headers: headers });
	}

	obrisiKorisnika(username: string)
	{
		return this.httpClient.post(environment.backendRuta + `admin/obrisiKorisnika`, { username: username });
	}

	//pretraga korisnika, idKorisnika koji vrsi pretragu i vrednost po kojoj se vrsi pretraga (samo po username-u)
	vratiRezultatePretrageKorisnika(idKorisnika: number, vrednost: string)
	{
		return this.httpClient.post(environment.backendRuta + `admin/pretraziKorisnike`, { pretrazuje: idKorisnika, username: vrednost });
		/*vraca niz:
		[
			{
				"ID": 10,
				"username": "marija",
				"slika": null,
				"rankPoeni": 0,
				"email": "us22er@gmail.com"
			}
		]
		*/
	}

	vratiRezultatePretrageAdministratora(idAdmin: number, vrednost: string)
	{
		return this.httpClient.post(environment.backendRuta + `admin/pretraziAdministratore`, { pretrazuje: idAdmin, username: vrednost });
	}

	dodeliAdminPrava(username: string)
	{
		return this.httpClient.post(environment.backendRuta + `admin/dajAdminPrava`, { username: username });
	}

	vratiSveAdmine()
	{
		return this.httpClient.post(environment.backendRuta + `admin/vratiSveAdministratore`, {});
	}

	ukloniAdminPrava(username: string)
	{
		return this.httpClient.post(environment.backendRuta + `admin/ukloniAdminPrava`, { username: username });
	}

	posaljiMejl(email, naslov, tekst)
	{
		return this.httpClient.post(environment.backendRuta + `admin/posaljiMejlKorisniku/`, { email: email, naslov: naslov, sadrzaj: tekst });
	}

	posaljiMejlSvimKorisicima(naslov, tekst)
	{
		return this.httpClient.post(environment.backendRuta + `admin/posaljiMejlSviKorisnicima/`, { naslov: naslov, sadrzaj: tekst });
	}

	dodajIgru(id, naziv, minBrojTimova, maxBrojTimova, opis, description, minBrojIgraca, maxBrojIgraca)
	{
		return this.httpClient.post(environment.backendRuta + `admin/dodajIgru`,
			{ naziv: naziv, minBrojTimova: minBrojTimova, maxBrojTimova: maxBrojTimova, opis: opis, description: description, minBrojIgraca: minBrojIgraca, maxBrojIgraca: maxBrojIgraca })
	}

	maxIDIgre()
	{
		return this.httpClient.get(environment.backendRuta + `admin/vratiMaxIDIgre`);
	}

	dodajTurnir(naziv, idTipa, idIgre, nazivIgre, brojTimova, pocetak, minRang, maxRang)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/dodajTurnir`, { naziv: naziv, maxBrojIgraca: brojTimova, datumPocetka: pocetak, tipTurnira: idTipa, idIgre: idIgre, nazivIgre: nazivIgre, zavrsen: false, minRang: minRang, maxRang: maxRang, kolo: [], ucesnici: [] });
	}

	obrisiIgru(idIgre)
	{
		return this.httpClient.post(environment.backendRuta + 'admin/obrisiIgru', { idIgre: idIgre });
	}

	azurirajIgru(igra)
	{
		return this.httpClient.post(environment.backendRuta + "admin/azurirajIgru", { igra });
	}

	obrisiTurnir(idTurnira)
	{
		return this.httpClient.post(environment.backendRuta + "mongo/obrisiTurnir", { idTurnira: idTurnira });
	}
}
