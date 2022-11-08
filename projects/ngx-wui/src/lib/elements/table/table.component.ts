import {
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output,
	ViewChild,
	HostBinding,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkColumnDef} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {ColumnModel, TableModel, tableSymbol} from './decorators';
import {HttpErrorResponse} from '@angular/common/http';

//? Simple type to represents @Input data's type (for now simply an array of any obj)
export type DataType = any[];

/**
 ** Generic table component to display mat-table sortable items with simplified config.
 ** Requires async data to be given !
 * @see mat-table https://material.angular.io/components/table/overview
 * @see original-inspiration https://stackblitz.com/edit/generic-mat-table?file=src%2Fapp%2Ftable%2Ftable.component.html,src%2Fapp%2Ftable%2Ftable.component.ts,src%2Fapp%2Fapp.component.ts
 */
@Component({
	selector: 'wui-table',
	template: `
		<table
			mat-table
			*ngIf="dataSource?.data?.length; else emptyList"
			[dataSource]="dataSource"
			matSort
			(matSortChange)="sortChanged($event)">
			<ng-container [matColumnDef]="column.key" *ngFor="let column of columns">
				<ng-container *ngIf="column.canSort; else noSort">
					<th
						mat-header-cell
						*matHeaderCellDef
						mat-sort-header="{{ column.key }}">
						{{ column.key }}
					</th>
				</ng-container>
				<ng-template #noSort>
					<th mat-header-cell *matHeaderCellDef>{{ column.key }}</th>
				</ng-template>
				<td mat-cell *matCellDef="let element">{{ element[column.key] }}</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
		</table>

		<ng-template #emptyList>
			<div
				*ngIf="isLoading; else wuiTableMessages"
				class="loading-shade flexed-centered">
				<mat-spinner></mat-spinner>
			</div>
		</ng-template>

		<ng-template #wuiTableMessages>
			<div class="wui-table-message flexed-centered" *ngIf="error">
				<p class="error-title">An error occured while fetching data!</p>
				<p>
					<span>
						<span>Status: </span> <em>{{ error.status }}</em>
					</span>
					-
					<span>
						<span>Description: </span> <strong>{{ error.statusText }}</strong>
					</span>
				</p>
			</div>
			<p class="wui-table-message flexed-centered" *ngIf="!isLoading && !error">
				No data to be shown 👀
			</p>
		</ng-template>
	`,
	styles: [
		':host {display: block; flex: 1; max-height: 100%; overflow-y: auto; margin: .125em .25em;}',
		':host table {width: 100%;}',
		':host .flexed-centered {display: flex; flex-flow: column; justify-content: center; align-items: center;}',
		':host .loading-shade {position: absolute; top: 0; left: 0; bottom: 56px; right: 0; background: rgba(0, 0, 0, 0.15); z-index: 1;}',
		':host .http-error-message {}',
		':host .wui-table-message {font-size: 1.2em; text-align: center; color: #333; padding-top: 1em; font-style: italic; height: 100%; }',
		':host .wui-table-message .error-title {font-style: normal; font-weight: bold; font-size: 1.4em; color: #f9423a;}',
	],
})
export class WuiTableComponent {
	@HostBinding('class') class = 'mat-elevation-z8';

	@Input() set data(values: DataType) {
		if (values && values.length > 0) this.renderTable(values);
	}
	@Input() isLoading = false;
	@Input() error?: HttpErrorResponse;

	@Output() sortChange: EventEmitter<Sort> = new EventEmitter();
	@ViewChild(MatSort) sort!: MatSort;

	dataSource!: MatTableDataSource<any>;
	displayedColumns!: string[];
	columns!: ColumnModel[];
	private _originalData: DataType = [];
	private _tableModel!: TableModel;

	/**
	 ** Synchronise MatTable Sort events w/ custom @Output SortChange that emit new MatSort element
	 ** That means consumers of this component must re-inject the new data (via dedicated input)
	 ** to be displayed according to new sort selection
	 *! Internal sort works only for number and string (NO date currently)
	 */
	sortChanged(params: Sort): void {
		//? also sort given table before emitting new Sort values
		const activeProp = params.active;
		// TODO Add Date support
		this.dataSource.data = params.direction
			? [...this.dataSource.data].sort(
					(a, b) =>
						(a[activeProp] < b[activeProp] ? -1 : 1) *
						(params.direction === 'asc' ? 1 : -1)
			  )
			: this._originalData;
		this.sortChange.emit(params);
	}

	/**
	 ** Will render or refresh table whenever new values are given.
	 ** Annoted propeties with '@Column() will be rendered w/ given options
	 * @param values Array of any objects (must be all same type)
	 */
	private renderTable(values: DataType): void {
		this.dataSource = new MatTableDataSource(Array.from(values));
		//? If table has already been created, dont render structure again (wont change)
		if (!this._originalData.length) this.buildColumns(values);
	}

	/**
	 ** Black magic happens here 🪄
	 */
	private buildColumns(values: DataType): void {
		this._tableModel = values[0][tableSymbol];
		this.columns = [...(this._tableModel?.columns ?? [])].sort(
			(c, n) => c.order - n.order
		);
		this.displayedColumns = this.columns.map(col => col.key);
		this._originalData = Array.from(values);
	}
}

@NgModule({
	imports: [
		CommonModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatSortModule,
		MatProgressSpinnerModule,
	],
	declarations: [WuiTableComponent],
	exports: [WuiTableComponent],
	providers: [CdkColumnDef],
})
export class WuiTableModule {}
