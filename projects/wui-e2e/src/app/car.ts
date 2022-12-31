import {Column} from 'ngx-wui';
import {autoserializeAs} from 'cerializr';

export class Car {
	@autoserializeAs(Number)
	id!: number;

	@autoserializeAs(String)
	@Column()
	maker!: string;

	@autoserializeAs(String)
	@Column({
		order: 1,
		canSort: true,
	})
	model!: string;

	@autoserializeAs(Number)
	@Column({
		canSort: true,
	})
	year!: number;

	@autoserializeAs(String)
	@Column()
	owner!: string;
}
