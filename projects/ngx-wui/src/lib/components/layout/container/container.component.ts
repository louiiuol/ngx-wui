import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'wui-container',
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./container.component.scss'],
	host: {class: 'container columns'},
})
export class ContainerComponent {
	@Input() gap = 2;
	@Input() size: 'desktop' | 'widescreen' | 'fullhd' = 'fullhd';

	@Input() justify? = 'space-evenly';
	@Input() align? = 'stretch';

	@HostBinding('class') class = `is-${this.gap}`;
	@HostBinding('style')
	style = `justify-content: ${this.justify}; align-items: ${this.align};`;
}
