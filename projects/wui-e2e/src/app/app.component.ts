import {Component} from '@angular/core';
import {map, Observable, of} from 'rxjs';

import {DeserializeArray, JsonArray} from 'cerializr';
import {Car} from './car';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'Testing library for WUI';
	// cars$!: Observable<Car[]>;
	config = {
		url: '',
		model: Car,
	};
	constructor() {}
}
