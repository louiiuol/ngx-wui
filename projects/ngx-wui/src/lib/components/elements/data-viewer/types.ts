export type SortField = 'name' | 'createdAt' | 'updatedAt';

export interface SortOptions {
	field: string;
	direction: 'ASC' | 'DESC';
}

export interface FilterOptions {
	search: string;
	field: string;
}

export interface DataTableAction {
	name: string;
	action: (data: string) => any;
	disabled?: boolean;
}

export interface DataTableActions {
	grouped?: DataTableAction[];
	individual?: DataTableAction[];
}

// Interface to display
// ex: User { uuid, name, email, ...}
// Filters to apply
// Actions available
//	- globally (with selection)
// -  individually (in column)
// +bonus: hasPaginator
export interface DataTableConfig {
	sort?: SortOptions;
	filters?: FilterOptions;
	//paginator?: Paginator;
	actions?: DataTableActions;
}
