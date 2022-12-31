import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	HttpClient,
	HttpClientModule,
	HttpErrorResponse,
	HttpParams,
} from '@angular/common/http';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {of, catchError, Subscription, mergeMap, tap, take, from} from 'rxjs';

import {DeserializeArray} from 'cerializr/dist/deserialize';

import {DataType, WuiTableComponent} from '../table/table.component';

/**
 ** Configuration interface for the entire component:
 ** 2 fields are required: url & model. The first is quite simple: base url to fetch resources
 ** The next, model is more tricky: you must pass an Interface containing property marked w/ @Column
 ** This enable to configure each column to be displayed dynamically depends on their options
 */
export interface WuiDataViewerConfig {
	url: string;
	model: any;
	searchable?: boolean;
	sortable?: boolean;
	paginator?: {
		hidePageSize?: boolean;
		showFirstLastButtons?: boolean;
		pageSize?: number;
		pageSizeOptions?: number[];
	};
}

export const defaultWuiDataViewerConfig: WuiDataViewerConfig = {
	url: 'error:url-not-provided',
	model: Object,
	searchable: false,
	sortable: true,
};

/**
 ** Generic Component to display complete list/table component including filters & pagination
 */
@Component({
	selector: 'wui-data-viewer',
	standalone: true,
	imports: [
		CommonModule,
		HttpClientModule,
		MatPaginatorModule,
		WuiTableComponent,
		MatProgressSpinnerModule,
	],
	template: `
		<header
			style="min-height: 60px; background: white; display: flex; justify-content: space-between; align-items: center"
			class="mat-elevation-z8">
			<p>Filters</p>
		</header>
		<wui-table
			#table
			style="margin: 25px 10px"
			[data]="dataSource"
			[error]="error"
			[isLoading]="isLoading"></wui-table>

		<mat-paginator
			*ngIf="!isLoading || (dataSource?.data?.length && config?.paginator)"
			[showFirstLastButtons]="!!config.paginator?.showFirstLastButtons"
			[pageSizeOptions]="config.paginator?.pageSizeOptions ?? [50]"
			[hidePageSize]="config.paginator?.hidePageSize ?? true"
			[pageSize]="config.paginator?.pageSize"
			aria-label="Select page for the search results">
		</mat-paginator>
	`,
	styles: [
		':host, :host > section {position: relative; display: flex; width: 100%; height: 100%; flex-flow: column nowrap; flex: 1}',
		':host action {}',
	],
})
export class WuiDataViewerComponent implements AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(WuiTableComponent) table!: WuiTableComponent;

	/**
	 * Main options @Input() for this component
	 */
	@Input() set config(config: WuiDataViewerConfig) {
		console.log('setting data');

		this._config = Object.assign(this._config ?? {}, config);
		this.getData();
	}

	get config(): WuiDataViewerConfig {
		return this._config;
	}

	dataSource!: MatTableDataSource<DataType>;

	isLoading = true;
	error?: HttpErrorResponse;
	private _config!: WuiDataViewerConfig;

	constructor(private _http: HttpClient) {}

	ngAfterViewInit() {
		if (this.dataSource) {
			this.table.sortChange.subscribe(sort => this.dataChanged(sort));

			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
				this.dataSource.paginator.page.subscribe(() => this.dataChanged());
			}
		} else {
			setTimeout(() => this.ngAfterViewInit(), 1000);
		}
	}

	/**
	 ** Function called whenever a new event occured that changes current data (Sorts, filters or pagination)
	 * @param event Sort event {active: string; direction: '' | 'asc' | 'desc'}
	 */
	dataChanged = (event?: Sort): void => {
		if (!this.dataSource) return;
		if (event) {
			this.dataSource.sort ??= Object.assign({}, this.table.sort);
			this.dataSource.sort.active = event.active;
			this.dataSource.sort.direction = event.direction;
		}
		//? If the user changes the sort order, reset back to the first page before launch new request.
		if (event && this.paginator) this.paginator.pageIndex = 0;
		this.getData();
	};

	/**
	 ** Fetch data from current url, and update datasource
	 * @returns Subscription details
	 */
	private getData = (event?: Sort): Subscription =>
		from(this.dataSource.data ?? [])
			.pipe(tap(() => (this.isLoading = true)))
			.pipe(
				mergeMap(() =>
					this._http.get<DataType>(this._config.url, {
						params: this.getParams(event),
					})
				)
			)
			.pipe(take(1))
			.pipe(
				catchError(err => {
					this.error = err;
					return of(undefined);
				})
			)
			.subscribe(data => {
				if (this.dataSource && data) {
					this.dataSource.data = this.deserializeData(data);
					console.log(this.dataSource.sort, event);
					this.table.sort = this.dataSource.sort ?? this.table.sort;
				} else if (data) {
					this.dataSource = new MatTableDataSource(this.deserializeData(data));
				}
				this.isLoading = false;
			});

	/**
	 ** Retrieved All current active filters and returns a cleaned (no nullish props) HttpParams object.
	 * @returns Cleaned HttpParams object containing all filters
	 */
	private getParams = (event?: Sort): HttpParams =>
		this.clean({
			_order: 'desc',
			_sort:
				((!!this.dataSource?.sort?.direction && event?.active) ??
					this.dataSource.sort?.active) ||
				undefined,

			page: this.dataSource?.paginator?.pageIndex,
			_limit:
				this.dataSource?.paginator?.pageSize ??
				this._config.paginator?.pageSize,

			//search: this.activeFilters.searchValue,
			//startAt: this.activeFilters.start,
			//endAt: this.activeFilters.end,
		});

	/**
	 ** Removes all Nullish props from given object and return a new copy
	 * @param obj Object to clean
	 * @returns cleaned new object as HttpParams
	 */
	private clean = (obj: unknown): HttpParams => {
		const res: any = Object.assign({}, obj);
		for (const propName in res) if (!res[propName]) delete res[propName];
		return res;
	};

	private deserializeData = (data: any): DataType =>
		DeserializeArray(Array.isArray(data) ? data : [], this._config.model);
}
