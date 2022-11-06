import {CommonModule} from '@angular/common';
import {
	Component,
	HostBinding,
	Input,
	NgModule,
	ViewEncapsulation,
} from '@angular/core';

export type ColumnSizes =
	| 'three-quarters'
	| 'two-thirds'
	| 'half'
	| 'one-third'
	| 'one-quarter'
	| 'full';

@Component({
	selector: 'wui-column',
	styles: ["@import 'bulma/sass/grid/columns';"],
	//styleUrls: ['./column.component.scss'],
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'column'},
})
export class WuiColumnComponent {
	@Input() size?: ColumnSizes;
	@Input() align? = 'stretch';

	@HostBinding('class') class = this.size ? `is-${this.size}` : '';
}

@NgModule({
	imports: [CommonModule],
	declarations: [WuiColumnComponent],
	exports: [WuiColumnComponent],
})
export class WuiColumnModule {}
