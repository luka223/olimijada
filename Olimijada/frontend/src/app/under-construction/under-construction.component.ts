import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
declare var $: any;

@Component({
	selector: 'app-under-construction',
	templateUrl: './under-construction.component.html',
	styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit
{


	constructor() { }

	ngOnInit()
	{
	}
	
}
