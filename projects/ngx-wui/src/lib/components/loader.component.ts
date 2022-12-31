import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
	selector: 'wui-loader',
	standalone: true,
	imports: [CommonModule, MatProgressSpinnerModule],
	template: `<mat-spinner></mat-spinner>`,
	styles: [
		':host {position: absolute; inset: 0; background: rgba(0, 0, 0, 0.15); z-index: 1;display: flex; flex-flow: column; justify-content: center; align-items: center;}',
	],
})
export class WuiLoaderComponent {}
