import { Injectable } from '@angular/core';
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class MecService
{
	constructor(private httpClient: HttpClient) { }


	vratiMec(idMeca: number)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/vratiMec`, { idMeca: idMeca });
	}

	vratisvePodatkeOUtakmici(idUtakmice: number)
	{
		return this.httpClient.post(environment.backendRuta + `mongo/sviPodaciOUtakmici`, { idUtakmice: idUtakmice });
	}


	vratiPozicijeIgracaUUtakmici(idUtakmice: number)
	{
		return this.httpClient.post(environment.backendRuta + `selNer/dajPozicijeBotova`, { idUtakmice: idUtakmice });
	}



}
