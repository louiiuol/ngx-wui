import {autoserializeAs} from 'cerializr';
import {Column} from 'ngx-wui';

export class UserView {
	id?: string;

	@autoserializeAs(String)
	@Column({
		canSort: true,
		order: 1,
	})
	name?: string;

	@autoserializeAs(String)
	@Column({
		order: 2,
	})
	email?: string;

	@autoserializeAs(String)
	@Column()
	phone?: string;

	@autoserializeAs(String)
	@Column()
	website?: string;
}
