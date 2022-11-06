import {Injectable} from '@angular/core';
import {HttpResource} from 'ngx-wui';
import {User} from './user';

@Injectable()
export class UserResource {
	root = 'dede';
}
