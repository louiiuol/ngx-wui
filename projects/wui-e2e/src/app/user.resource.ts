import {Injectable} from '@angular/core';
import {HttpResource} from 'ngx-wui';
//import {User} from './user';

@Injectable()
export class UserResource extends HttpResource<User> {
	root = 'api/';
	yolo() {
		this.get('cecec').pipe(rete => console.log(rete));
	}
}
