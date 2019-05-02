import { Component, HostListener } from '@angular/core';
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent
{
	/*
	@HostListener("window:beforeunload", ["$event"])
	clearLocalStorage(event)
	{
		localStorage.clear();
	}*/

	constructor() { }
}
