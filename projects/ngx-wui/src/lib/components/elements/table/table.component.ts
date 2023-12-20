import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	HostBinding,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {CdkColumnDef} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';

import {ColumnModel, TableModel, tableSymbol} from './decorators';
import {WuiLoaderComponent} from '../../loader.component';

// Simple type to represents @Input data's type (for now simply an array of any obj)
export type DataType = any[];

/**
 * Generic table component to display mat-table sortable items with simplified config.
 * Requires async data to be given !
 * @see mat-table https://material.angular.io/components/table/overview
 * @see original-inspiration https://stackblitz.com/edit/generic-mat-table?file=src%2Fapp%2Ftable%2Ftable.component.html,src%2Fapp%2Ftable%2Ftable.component.ts,src%2Fapp%2Fapp.component.ts
 */
@Component({
	selector: 'wui-table',
	standalone: true,
	imports: [
		CommonModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatSortModule,
		WuiLoaderComponent,
	],
	providers: [CdkColumnDef],
	template: `
		<wui-loader *ngIf="isLoading; else WuiTableResponse"></wui-loader>

		<ng-template #WuiTableResponse>
			<table
				mat-table
				*ngIf="dataSource && dataSource?.data?.length; else wuiTableMessages"
				[dataSource]="dataSource"
				matSort
				(matSortChange)="sortChanged($event)">
				<ng-container
					[matColumnDef]="column.key"
					*ngFor="let column of columns">
					<ng-container *ngIf="column.canSort; else noSort">
						<th
							*matHeaderCellDef
							mat-header-cell
							mat-sort-header="{{ column.key }}">
							{{ column.key }}
						</th>
					</ng-container>
					<ng-template #noSort>
						<th mat-header-cell *matHeaderCellDef>{{ column.key }}</th>
					</ng-template>
					<td mat-cell *matCellDef="let element">{{ element[column.key] }}</td>
				</ng-container>

				<tr
					mat-header-row
					*matHeaderRowDef="displayedColumns; sticky: true"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
			</table>
		</ng-template>

		<ng-template #wuiTableMessages>
			<div
				class="wui-table-message flexed-centered"
				*ngIf="error; else EmptyList">
				<p class="error-title">An error occured while fetching data!</p>
				<p>
					<span>
						Status: <em>{{ error.status }}</em>
					</span>
					-
					<span>
						Description: <strong>{{ error.statusText }}</strong>
					</span>
				</p>
			</div>
		</ng-template>

		<ng-template #EmptyList>
			<p class="wui-table-message flexed-centered">No data to be shown 👀</p>
		</ng-template>
	`,
	styles: [
		':host {display: block; flex: 1; max-height: 100%; overflow-y: auto; margin: .125em .25em;position: relative;}',
		':host table {width: 100%;}',
		':host .flexed-centered {display: flex; flex-flow: column; justify-content: center; align-items: center;}',
		':host .loading-shade {position: absolute; inset: 0; background: rgba(0, 0, 0, 0.15); z-index: 1;}',
		':host .wui-table-message {font-size: 1.2em; text-align: center; color: #333; padding-top: 1em; font-style: italic; height: 100%; }',
		':host .wui-table-message .error-title {font-style: normal; font-weight: bold; font-size: 1.4em; color: #f9423a;}',
	],
})
export class WuiTableComponent {
	@HostBinding('class') class = 'mat-elevation-z8';

	/**
	 * Array of any elements to be displayed. Could also be a MatTableDataSource if needed
	 */
	@Input() set data(values: DataType | MatTableDataSource<any>) {
		console.log('setting table data');
		if (values) this.renderTable(values);
	}

	@Input() isLoading = false;
	@Input() error?: HttpErrorResponse;

	@Output() sortChange: EventEmitter<Sort> = new EventEmitter();
	@ViewChild(MatSort) sort?: MatSort;

	dataSource?: MatTableDataSource<any>;
	displayedColumns!: string[];
	columns!: ColumnModel[];
	private _originalData: DataType = [];
	private _tableModel!: TableModel;
	private _lastParams?: Sort;

	/**
	 * Synchronise MatTable Sort events w/ custom @Output SortChange that emit new MatSort element
	 * That means consumers of this component must re-inject the new data (via dedicated input)
	 * to be displayed according to new sort selection (also sort given table before emitting new Sort values)
	 * * Internal sort works only for number and string (NO date currently)
	 */
	sortChanged = (sortParams: Sort): void => {
		console.log('sorting');

		this._lastParams = Object.assign({}, sortParams);

		if (this.dataSource)
			this.dataSource.data = this.sortData(
				this.dataSource.data,
				this._lastParams
			);

		if (this.sort) {
			this.sort.active = sortParams.active;
			this.sort.direction = sortParams.direction;
		}
		this.sortChange.emit(this._lastParams);
		console.log(this._lastParams);
	};

	/**
	 * Will render or refresh table whenever new values are given.
	 * Annoted propeties with '@Column() will be rendered w/ given options
	 * @param source Array of any objects (must be all same type)
	 */
	private renderTable = (source: DataType | MatTableDataSource<any>): void => {
		console.log('rendering table');

		this.dataSource = Array.isArray(source)
			? new MatTableDataSource(Array.from(source))
			: source;

		//? If table has already been created, dont render structure again (wont change)
		if (!this._originalData.length)
			this.buildColumns(Array.isArray(source) ? source : source.data);

		if (this._lastParams && this.sort) {
			this.sort.active = this._lastParams.active;
			this.sort.direction = this._lastParams.direction;
		}
	};

	/**
	 * Black magic happens here 🪄
	 */
	private buildColumns = (values: DataType): void => {
		this._tableModel = values[0][tableSymbol];
		this.columns = [...(this._tableModel?.columns ?? [])].sort(
			(c, n) => c.order - n.order
		);
		this.displayedColumns = this.columns.map(col => col.key);
		this._originalData = Array.from(values);
	};

	// TODO Add Date support
	private sortData = (data: any[], p: Sort): any[] =>
		!p.direction
			? this._originalData
			: [...data].sort(
					(a, b) =>
						(a[p.active] < b[p.active] ? -1 : 1) *
						(p.direction === 'asc' ? 1 : -1)
			  );
}
