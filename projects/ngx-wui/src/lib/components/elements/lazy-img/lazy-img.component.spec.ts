import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LazyImgComponent} from '@shared/elements';
import {SharedModule} from '@shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LazyImgComponent', () => {
	let component: LazyImgComponent;
	let fixture: ComponentFixture<LazyImgComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SharedModule, BrowserAnimationsModule],
			declarations: [LazyImgComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LazyImgComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
