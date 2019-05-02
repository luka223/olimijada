export class pozicijaIgraca{
	public idTima:number;
	public vremePoteza:number;
	public x:number;
	public y:number;

	constructor(idTima:number,vremePoteza:number,x:number,y:number){
		this.idTima=idTima;
		this.vremePoteza=vremePoteza;
		this.x=x;
		this.y=y;

	}
	toString()
	{
		return "x: "+this.x+" y: "+this.y+" vreme:"+this.vremePoteza;
	}

}