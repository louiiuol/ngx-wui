/**
 ** List of options for each column
 */
export class ColumnModel {
	key: string;
	order: number;
	propertyType?: string;
	canSort: boolean;

	constructor(options: Partial<ColumnModel> = {}) {
		this.key = options.key ?? '';
		this.order = options.order || 100;
		this.propertyType = options.propertyType;
		this.canSort = options.canSort || false;
	}
}

/**
 ** Class representing Table with columns described above
 */
export class TableModel {
	columns: ColumnModel[] = [];

	addColumn(column: ColumnModel) {
		this.columns = [...this.columns, column];
	}
}
