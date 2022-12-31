import {Component} from '@angular/core';
import {WuiDataViewerConfig} from 'ngx-wui';

import {Car} from './car';
import {UserView} from './user';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'Testing library for NGX-WUI (Pre-V1.0.0)';
	config: WuiDataViewerConfig = {
		url: 'assets/cars.json',
		model: Car,
		paginator: {
			// pageSize: 5,
		},
	};

	config2: WuiDataViewerConfig = {
		url: 'https://jsonplaceholder.typicode.com/users',
		model: UserView,
		paginator: {
			pageSize: 5,
		},
	};
}
