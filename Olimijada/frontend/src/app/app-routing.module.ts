import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { StranaProfilaComponent } from './korisnik/strana-profila/strana-profila.component';
import { TimoviComponent } from './korisnik/strana-profila/timovi/timovi.component';
import { BotoviComponent } from './korisnik/strana-profila/botovi/botovi.component';
import { IgraComponent } from './korisnik/igre/igra.component';
import { HomeLoggedInComponent } from "./korisnik/home-logged-in/home-logged-in.component";
import { HomeLoggedOutComponent } from "./korisnik/home-logged-out/home-logged-out.component";
import { DetaljiProfilaComponent } from './korisnik/strana-profila/detalji-profila/detalji-profila.component';
import { MenuComponent } from './korisnik/menu/menu.component';
import { StranaMecaComponent } from './korisnik/strana-meca/strana-meca.component';
import { AuthGuard } from './guards/auth.guard';
import { VizuelizacijaMecaComponent } from './korisnik/strana-meca/vizuelizacija-meca/vizuelizacija-meca.component';
import { TurniriComponent } from './korisnik/turniri/turniri.component';
import { JavniProfilComponent } from './korisnik/strana-profila/javni-profil/javni-profil.component';
import { LigeTurniriComponent } from './administrator/komponente/lige-turniri/lige-turniri.component';
import { AdminHomeComponent } from './administrator/komponente/admin-home/admin-home.component';
import { SignInComponent } from './korisnik/home-logged-out/sign-in/sign-in.component';
import { SignUpComponent } from './korisnik/home-logged-out/sign-up/sign-up.component';
import { ValidacijaNalogaComponent } from "./korisnik/validacija-naloga/validacija-naloga.component";
import { AdminSignInComponent } from "./administrator/komponente/admin-sign-in/admin-sign-in.component";
import { DodavanjeIgreComponent } from './administrator/komponente/dodavanje-igre/dodavanje-igre.component';

import { AdministracijaKorisnikaComponent } from './administrator/komponente/administracija-korisnika/administracija-korisnika.component';
import { AuthGuardAdminService } from './guards/auth-guard-admin.service';
import { PregledIgaraComponent } from './administrator/komponente/pregled-igara/pregled-igara.component';
import { PregledTurniraComponent } from './administrator/komponente/pregled-turnira/pregled-turnira.component';
const routes: Routes = [
	{
		path: '',
		component: HomeLoggedOutComponent,
		children: [
			{ path: '', component: SignInComponent },
			{ path: 'signup', component: SignUpComponent }
		]
	},
	{
		path: 'home',
		component: HomeLoggedInComponent,
		canActivate: [AuthGuard]
	},

	{ path: 'adminsignin', component: AdminSignInComponent },
	{
		path: 'mec/:id',
		component: StranaMecaComponent,
		//canActivate: [AuthGuard],
		children: [
			{ path: 'vizuelizacija', component: VizuelizacijaMecaComponent }
		]
	},
	{
		path: 'admin',
		component: AdminHomeComponent,
		canActivate: [AuthGuardAdminService],
		children: [
			{ path: 'turniri', component: PregledTurniraComponent },
			{ path: 'korisnici', component: AdministracijaKorisnikaComponent },
			{ path: 'igre', component: PregledIgaraComponent }
		]
	},
	{ path: 'igre/:naziv', component: IgraComponent },
	{ path: 'turnir/:id', component: TurniriComponent },
	{ path: 'profil/:username', component: StranaProfilaComponent },
	{ path: 'detalji-profila', component: DetaljiProfilaComponent },
	{ path: 'validacija', component: ValidacijaNalogaComponent },
	//sve putanje moraju da budu iznad ovoga ** inace nece da radi
	{ path: '**', component: UnderConstructionComponent }
];


@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes)],
})

export class AppRoutingModule { }
