import {Component, NgModule, Input} from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {DataType, WuiTableModule} from '../table/table.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {JsonArray} from 'cerializr/dist/interfaces';
import {DeserializeArray} from 'cerializr/dist/deserialize';

export interface DataViewerConfig {
	url: string;
	model: any;
	search?: {
		value: string;
		attr: string;
	};
	filters?: any;
	paginator?: boolean;
}

/**
 ** Generic Component to display complete list/table component including filters & pagination
 */
@Component({
	selector: 'wui-data-viewer',
	template: `<nav>Filters</nav>
		<wui-table [data]="data | async"></wui-table>
		<mat-paginator
			hidePageSize
			showFirstLastButtons
			(page)="pageEvent = $event"
			aria-label="Select page">
		</mat-paginator> `,
})
export class WuiDataViewerComponent {
	@Input() config?: DataViewerConfig;
	data: Observable<DataType>;
	pageSize = 10;
	pageEvent!: PageEvent;
	constructor(private _http: HttpClient) {
		this.data = this.getData();
	}

	private getData = (params?: any) =>
		// this.data = _http.get<any>(this.config?.url ?? '', {});
		of([
			{
				id: 1,
				maker: 'Chevrolet',
				model: 'Sportvan G20',
				year: 1993,
				owner: 'tom',
			},
			{
				id: 2,
				maker: 'Jeep',
				model: 'Patriot',
				year: 2007,
				owner: 'tom',
			},
			{
				id: 3,
				maker: 'Ferrari',
				model: '612 Scaglietti',
				year: 2008,
				owner: 'tom',
			},
			{
				id: 4,
				maker: 'Ford',
				model: 'Thunderbird',
				year: 1995,
				owner: 'tom',
			},
			{id: 5, maker: 'GMC', model: 'Canyon', year: 2012, owner: 'tom'},
			{id: 6, maker: 'Volvo', model: 'V70', year: 2009, owner: 'tom'},
			{
				id: 7,
				maker: 'Suzuki',
				model: 'Grand Vitara',
				year: 2010,
				owner: 'tom',
			},
			{id: 8, maker: 'Ford', model: 'Escort', year: 1990, owner: 'tom'},
			{
				id: 9,
				maker: 'Toyota',
				model: 'Yaris',
				year: 2009,
				owner: 'tom',
			},
			{id: 10, maker: 'Infiniti', model: 'M', year: 2003, owner: 'tom'},
		]).pipe(
			map((res: JsonArray) =>
				DeserializeArray(res, this.config?.model ?? String)
			)
		);
}

@NgModule({
	imports: [CommonModule, HttpClientModule, MatPaginatorModule, WuiTableModule],
	declarations: [WuiDataViewerComponent],
	exports: [WuiDataViewerComponent],
})
export class WuiDataViewerModule {}
