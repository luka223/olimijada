import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2Webstorage } from 'ngx-webstorage';
import { AppComponent } from './app.component';
import { AuthService } from './servisi/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { MenuComponent } from './korisnik/menu/menu.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { StranaProfilaComponent } from './korisnik/strana-profila/strana-profila.component';
import { TimoviComponent } from './korisnik/strana-profila/timovi/timovi.component';
import { BotoviComponent } from './korisnik/strana-profila/botovi/botovi.component';
import { IgraComponent } from './korisnik/igre/igra.component';
import { BotoviService } from './servisi/botovi.service';
import { TimoviService } from './servisi/timovi.service';
import { HomeLoggedInComponent } from './korisnik/home-logged-in/home-logged-in.component';
import { HomeLoggedOutComponent } from './korisnik/home-logged-out/home-logged-out.component';
import { DetaljiProfilaComponent } from './korisnik/strana-profila/detalji-profila/detalji-profila.component';
import { FooterComponent } from './korisnik/footer/footer.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { VizuelizacijaMecaComponent } from './korisnik/strana-meca/vizuelizacija-meca/vizuelizacija-meca.component';
import { StranaMecaComponent } from './korisnik/strana-meca/strana-meca.component';
import { AuthGuard } from './guards/auth.guard';
import { UploadService } from './servisi/upload.service';
import { IgraService } from './servisi/igra.service';
import { KorisnikService } from './servisi/korisnik.service';
import { MecService } from './servisi/mec.service';
import { TurnirService } from './servisi/turnir.service';
import { AuthInterceptorService } from './servisi/auth-interceptor.service';
import { TurniriComponent } from './korisnik/turniri/turniri.component';
import { ChartCommonModule } from '@swimlane/ngx-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SignInComponent } from './korisnik/home-logged-out/sign-in/sign-in.component';
import { SignUpComponent } from './korisnik/home-logged-out/sign-up/sign-up.component';
import { JavniProfilComponent } from './korisnik/strana-profila/javni-profil/javni-profil.component';
import { LigeTurniriComponent } from './administrator/komponente/lige-turniri/lige-turniri.component';
import { AdminHomeComponent } from './administrator/komponente/admin-home/admin-home.component';
import { SlajderComponent } from './korisnik/slajder/slajder.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { RangListaTurniraComponent } from './korisnik/rang-lista-turnira/rang-lista-turnira.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ValidacijaNalogaComponent } from './korisnik/validacija-naloga/validacija-naloga.component';
import { PrijavaNaTurnirComponent } from './korisnik/prijava-na-turnir/prijava-na-turnir.component';
import { AdminService } from './servisi/admin.service';
import { AdminSignInComponent } from './administrator/komponente/admin-sign-in/admin-sign-in.component';
import { AdministracijaKorisnikaComponent } from './administrator/komponente/administracija-korisnika/administracija-korisnika.component';
import { DodavanjeIgreComponent } from './administrator/komponente/dodavanje-igre/dodavanje-igre.component';
import { TestTimaComponent } from "./korisnik/strana-profila/test-tima/test-tima.component";
import { LigaComponent } from './korisnik/turniri/liga/liga.component';
import { KupComponent } from './korisnik/turniri/kup/kup.component';
import { AuthGuardAdminService } from './guards/auth-guard-admin.service';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { RecaptchaModule } from 'ng-recaptcha';
import { DataService } from './servisi/data.service';
import { PregledIgaraComponent } from './administrator/komponente/pregled-igara/pregled-igara.component';
import { PregledTurniraComponent } from './administrator/komponente/pregled-turnira/pregled-turnira.component';
import { IzmenaIgreComponent } from './administrator/komponente/izmena-igre/izmena-igre.component';
import { ChartsModule } from 'ng2-charts';

export function HttpLoaderFactory(http: HttpClient)
{
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		MenuComponent,
		UnderConstructionComponent,
		StranaProfilaComponent,
		TimoviComponent,
		BotoviComponent,
		HomeLoggedInComponent,
		HomeLoggedOutComponent,
		DetaljiProfilaComponent,
		FooterComponent,
		VizuelizacijaMecaComponent,
		IgraComponent,
		StranaMecaComponent,
		TurniriComponent,
		SignInComponent,
		SignUpComponent,
		JavniProfilComponent,
		LigeTurniriComponent,
		AdminHomeComponent,
		SlajderComponent,
		RangListaTurniraComponent,
		ValidacijaNalogaComponent,
		PrijavaNaTurnirComponent,
		AdminSignInComponent,
		AdministracijaKorisnikaComponent,
		DodavanjeIgreComponent,
		TestTimaComponent,
		LigaComponent,
		KupComponent,
		PregledIgaraComponent,
		PregledTurniraComponent,
		IzmenaIgreComponent
	],
	imports: [
		BrowserModule,
		Ng2Webstorage,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		NgbModule.forRoot(),
		ModalModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		AceEditorModule,
		ChartsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		NgxChartsModule,
		NgxGraphModule,
		ScrollToModule.forRoot(),
		RecaptchaModule.forRoot()
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true
		},
		AuthService,
		CookieService,
		BotoviService,
		TimoviService,
		KorisnikService,
		MecService,
		TurnirService,
		AuthGuard,
		UploadService,
		IgraService,
		AdminService,
		DataService,
		AuthGuardAdminService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
