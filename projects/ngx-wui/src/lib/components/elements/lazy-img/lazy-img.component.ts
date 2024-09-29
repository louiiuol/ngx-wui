import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';

@Component({
	standalone: true,
	selector: 'wui-lazy-img',
	templateUrl: './lazy-img.component.html',
	styleUrls: ['./lazy-img.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyImgComponent implements OnChanges {
	@Input() src!: string;
	@Input() alt = '';

	isError = false;
	isLoading: boolean;

	constructor(private cdRef: ChangeDetectorRef) {
		this.isLoading = true;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['src']) {
			this.isLoading = true;
			this.src = changes['src'].currentValue;
			this.cdRef.detectChanges();
		}
	}

	hideLoader = () => (this.isLoading = false);

	error = () => (this.isError = true);
}
