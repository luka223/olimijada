export class TimoviUTakmicenju
{

	ID: number;
	naziv: string;
	idKorisnika: number;
	nazivKorisnika: number;
	brojPobeda: number;
	brojPoraza: number;
	brojNeresenih: number;
	brojPoena: number;
	pozicija: number;

	constructor(ID, naziv, idKorisnika, nazivKorisnika)
	{
		this.ID = ID;
		this.naziv = naziv;
		this.idKorisnika = idKorisnika;
		this.nazivKorisnika = nazivKorisnika;
		this.brojPobeda = this.brojPoraza = this.brojNeresenih = this.brojPoena = 0;
		this.pozicija = undefined;
	}
}