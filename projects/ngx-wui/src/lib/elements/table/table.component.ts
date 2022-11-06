import {Component, Input, NgModule} from '@angular/core';
import {MatSortModule, Sort, SortDirection} from '@angular/material/sort';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {CdkColumnDef} from '@angular/cdk/table';
import {ColumnModel, TableModel, tableSymbol} from './decorators';

//? Simple type to represents @Input data's type (for now simply an array of any obj)
export type DataType = any[];

/**
 ** Generic table component to display mat-table sortable items with simplified config.
 ** Requires async data to be given !
 * @see mat-table https://material.angular.io/components/table/overview
 * @see example-use https://stackblitz.com/edit/generic-mat-table?file=src%2Fapp%2Ftable%2Ftable.component.html,src%2Fapp%2Ftable%2Ftable.component.ts,src%2Fapp%2Fapp.component.ts
 */
@Component({
	selector: 'wui-table',
	template: `
		<table
			class="mat-elevation-z8"
			mat-table
			[dataSource]="dataSource"
			matSort
			(matSortChange)="sortData($event)">
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

			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

			<!-- Row shown when there is no matching data. -->
			<tr class="mat-row" *matNoDataRow>
				<td class="mat-cell" colspan="4">
					No data matching the filter
					<!--  "{{ input.value }}" -->
				</td>
			</tr>
		</table>
	`,
	styles: [':host table {width: 100%;}'],
})
export class WuiTableComponent {
	private _data: DataType = [];
	private _originalData: DataType = [];
	private _tableModel!: TableModel;

	@Input() set data(values: DataType | null) {
		if (values && values.length > 0) {
			this.buildColumns(values);
			//? Keep original order of data
			if (this._originalData.length) return;
			this._originalData = Array.from(this._data);
		}
	}
	get data(): DataType {
		return this._data;
	}

	get dataSource(): any {
		return new MatTableDataSource(this._data);
	}

	// @Input() instance: DataType;

	columns!: ColumnModel[];
	displayedColumns!: string[];

	sortData(params: Sort): void {
		const direction: SortDirection = params.direction;
		this.data = direction
			? this.orderBy(this.data, params.active, direction)
			: this._originalData;
	}

	private buildColumns(values: DataType): void {
		this._data = Array.from(values);
		this._tableModel = this._data[0][tableSymbol];
		this.columns = [...(this._tableModel?.columns ?? [])].sort(
			(c, n) => c.order - n.order
		);
		this.displayedColumns = this.columns.map(col => col.key);
	}

	private orderBy = (data: DataType, prop: string, dir: SortDirection) =>
		[...data].sort(
			(a, b) => (a[prop] < b[prop] ? -1 : 1) * (dir === 'asc' ? 1 : -1)
		);
}

@NgModule({
	imports: [
		CommonModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatSortModule,
	],
	declarations: [WuiTableComponent],
	exports: [WuiTableComponent],
	providers: [CdkColumnDef],
})
export class WuiTableModule {}
