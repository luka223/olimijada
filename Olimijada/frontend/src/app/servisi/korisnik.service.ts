import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlatformLocation } from '@angular/common';


@Injectable()
export class KorisnikService
{
	constructor(
		private location: PlatformLocation,
		private httpClient: HttpClient
	) { }

	activate: boolean;

	// stari naziv - getNajboljiBotoviKorisnika
	vratiNajboljeBotoveKorisnika(idKorsnika: number)
	{
		return this.httpClient.post(environment.backendRuta + 'select/vratiNajboljeBotoveKorisnika', { idKorisnika: idKorsnika });
	}

	azurirajPodatke(idKorisnika: number, trenuniPassword: string, noviPassword: string, email: string)
	{
		if (trenuniPassword == "")
		{
			return this.httpClient.post(environment.backendRuta + `update/azurirajMejl/`,
				{ idKorisnika: idKorisnika, email: email });
		}
		else
		{
			return this.httpClient.post(environment.backendRuta + `update/azurirajSvePodatke/`,
				{ idKorisnika: idKorisnika, trenutniPass: trenuniPassword, noviPass: noviPassword, email: email });
		}
	}

	azurirajJezik(idKorisnika: number, jezik: string)
	{
		return this.httpClient.post(environment.backendRuta + `update/azurirajJezikKorisnika`, { idKorisnika: idKorisnika, jezik: jezik });
	}

	// getSportoviKojeJeKorisnikNajviseIgrao
	vratiPetIgaraKojeJeKorisnikNajviseIgrao(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + 'select/vratiPetNajpopularnijihIgaraKorisnika', { idKorisnika: idKorisnika });
	}

	vratiSveIgreSortiranePoKorisniku(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + 'select/sveIgreSortiranePoKorisniku', { idKorisnika: idKorisnika });
	}

	// getMyBestTeams - uklonjeni tipovi zbog castovanja
	vratiKorisnikoveNajboljeTimove(idKorisnika, idIgre)
	{
		return this.httpClient.post(environment.backendRuta + `select/mojiNajboljiTimovi`, { idKorisnika: idKorisnika, idIgre: idIgre });
	}

	// botoviKorisnikaZaOdredjenuIgru
	vratiBotoveKorisnikaZaOdredjenuIgru(idKorisnika: number, idIgre: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/botoviKorisnikaZaOdredjenuIgru`, { idKorisnika: idKorisnika, idIgre: idIgre });
	}

	vratiKorisnika(username: string)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiKorisnikaNaOsnovuUsernamea`, { username: username });
	}

	vratiRankPoeneKorisnika(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiRankPoeneKorisnika`, { idKorisnika: idKorisnika });
	}

	resendMail(username)
	{
		return this.httpClient.post(environment.backendRuta + `insert/sendMail`, { username: username, address: (this.location as any).location.origin });
	}

	slanjeKodaZaboravljenaSifra(email)
	{
		return this.httpClient.post(environment.backendRuta + `insert/sendCode`, { email: email });
	}
	promeniSifru(id, password1)
	{
		return this.httpClient.post(environment.backendRuta + `update/promeniSifru`, { idKorisnika: id, password: password1 });
	}

	aktivirajKorisnika(kod)
	{
		return this.httpClient.post(environment.backendRuta + `update/aktivirajKorisnika`, { kod: kod });
	}

	vratiProfilnuSliku(idKorisnika: number)
	{
		return this.httpClient.get(environment.backendRuta + `select/vratiProfilnuSliku/${idKorisnika}`, { responseType: 'blob' });
	}

	vratiMeceveKorisnika(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiMeceveKorisnika`, { idKorisnika: idKorisnika });
	}

	vratiNotifikacije(idKorisnika: number)
	{
		return this.httpClient.post(environment.backendRuta + `select/vratiNotifikacije`, { idKorisnika: idKorisnika });
	}

	procitajNotifikaciju(idNotifikacije: number)
	{
		// stavi indikator da je procitana
		return this.httpClient.post(environment.backendRuta + `update/procitajNotifikaciju`, { idNotifikacije: idNotifikacije });
	}
}
