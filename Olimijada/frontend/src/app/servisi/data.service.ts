import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService
{

	private newTim = new BehaviorSubject<Boolean>(false);
	newTimChange = this.newTim.asObservable();

	private oldTim = new BehaviorSubject<Boolean>(false);
	deleteTimChange = this.oldTim.asObservable();

	private newIgra = new BehaviorSubject<Boolean>(false);
	newIgraChange = this.newIgra.asObservable();



	constructor() { }

	newIgraAdd(flag: Boolean)
	{
		this.newIgra.next(flag);
	}
	newTimAdd(flag: Boolean)
	{
		this.newTim.next(flag);
	}


	newTimDelete(flag: Boolean)
	{
		this.oldTim.next(flag);
	}

}
