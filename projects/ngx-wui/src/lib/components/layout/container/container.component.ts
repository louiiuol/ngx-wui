import {CommonModule} from '@angular/common';
import {
	Component,
	HostBinding,
	Input,
	NgModule,
	ViewEncapsulation,
} from '@angular/core';

/**
 ** Container component to wrap various content (helps with responsive)
 */
@Component({
	selector: 'wui-container',
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./container.component.scss'],
	host: {class: 'container columns'},
})
export class WuiContainerComponent {
	@Input() gap = 2;
	@Input() size: 'desktop' | 'widescreen' | 'fullhd' = 'fullhd';

	@Input() flow? = 'row';
	@Input() justify? = 'space-evenly';
	@Input() align? = 'stretch';

	@HostBinding('class') class = `is-${this.gap}`;
	@HostBinding('style')
	style = `
		flex-flow:  ${this.flow};
		justify-content: ${this.justify};
		align-items: ${this.align};
	`;
}

@NgModule({
	imports: [CommonModule],
	declarations: [WuiContainerComponent],
	exports: [WuiContainerComponent],
})
export class WuiContainerModule {}
