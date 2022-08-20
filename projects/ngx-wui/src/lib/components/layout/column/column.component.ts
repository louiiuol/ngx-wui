import {
	Component,
	HostBinding,
	Input,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';

type ColumnSizes =
	| 'three-quarters'
	| 'two-thirds'
	| 'half'
	| 'one-third'
	| 'one-quarter'
	| 'full';

@Component({
	selector: 'wui-column',
	styleUrls: ['./column.component.scss'],
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'column'},
})
export class ColumnComponent implements OnInit {
	@Input() size?: ColumnSizes;
	@Input() align? = 'stretch';

	@HostBinding('class') class = this.size ? `is-${this.size}` : '';

	constructor() {
		const test = this.align === 'stretch';
	}

	ngOnInit = (): void => {};
}
