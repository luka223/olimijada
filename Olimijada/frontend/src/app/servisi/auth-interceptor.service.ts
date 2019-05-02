import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor
{
	constructor(
		private authSerivce: AuthService,
		private router: Router
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
	{
		// ukoliko zahtev ne sadrzi http u url-u, onda je lokalni (GET do fajlova u assets folderu)
		// pa nece proci uslov, i nece obraditi zahtev, vec ce ga samo izvrsiti
		if (req && req.url.indexOf('http') >= 0)
		{
			// ako je definisan token za korisnika, postavlja ga u header
			if (localStorage.getItem('currentUser'))
			{
				req = req.clone({
					headers: req.headers.set('Authorization', localStorage.getItem('currentUser'))
				});
			}

			// ako je definisan token za admina, postavlja ga u header
			if (localStorage.getItem('currentAdmin'))
			{
				req = req.clone({
					headers: req.headers.set('AuthorizationAdmin', localStorage.getItem('currentAdmin'))
				});
			}

			return next.handle(req).do(
				(event: HttpEvent<any>) =>
				{
					// ukoliko je dogadjaj http odgovor
					if (event instanceof HttpResponse)
					{
						// uzima novi token iz headera dobijen od backend servera
						let token = event.headers.get('Token');

						// ukoliko postoji token
						// (ukoliko se zove ruta za koju nije potrebna autorizacija, nece biti tokena, pa je potrebna provera)
						if (token != null)
							localStorage.setItem('currentUser', token);
						else
						{
							let tokenAdmin = event.headers.get('TokenAdmin');
							if (tokenAdmin != null)
								localStorage.setItem('currentAdmin', tokenAdmin);
						}
					}
				},

				(err) =>
				{
					// ukoliko se desila greska sa kodom 401 (neautorizovano), izloguj korisnika
					if (err.status == 401)
					{
						if (err.error == "admin")
							this.authSerivce.logOutAdmin();
						else
							this.authSerivce.logOut();
					}
				}
			);
		}
		else
			return next.handle(req);
	}

}
