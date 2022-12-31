import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';

/**
 ** Current page settings & informations
 */
export interface Paginator {
	page: number;
	items: number;
	total: number;
}

/**
 ** Represents wrapper for every response from API
 */
export interface APIResponse<T> {
	code: number;
	data: T;
	message?: string[];
	error?: string[];
	pagination: Paginator;
}

/**
 ** List of elements (data) customisable with 'pagination' property
 */
export interface Pageable<T> {
	data: T[];
	pagination: Paginator;
}

export interface IHttpResource {
	root: string;
	get(uuid: string): Observable<unknown | undefined>;
	getAll(params?: {
		headers?: HttpHeaders | {[header: string]: string | string[]};
	}): Observable<Pageable<unknown>>;
	create(dto: unknown): Observable<unknown>;
	update(uuid: string, dto: unknown): Observable<unknown | undefined>;
	delete(uuid: string): Observable<void>;
}

/**
 ** Abstract Service that provides all basic CRUD methods formated as REST requests
 ** Must be implemented with {R} Resource type to be fetched
 */
@Injectable()
export abstract class HttpResource<R> implements IHttpResource {
	abstract root: string; //? .../api/resources
	constructor(protected http: HttpClient) {}

	get = <R>(uuid: string): Observable<R | undefined> =>
		this.http
			.get<APIResponse<R>>(this.specificURI(uuid))
			.pipe(catchError(this.catchError))
			.pipe(
				map(res => {
					console.log(res);
					return res.data as R;
				})
			);

	getAll = (params?: {
		headers?: HttpHeaders | {[header: string]: string | string[]};
	}): Observable<Pageable<R>> =>
		this.http
			.get<APIResponse<R[]>>(this.root, params)
			.pipe(catchError(this.catchError))
			.pipe(
				map(res => ({
					data: (res.data as R[]) ?? [],
					pagination: res.pagination,
				}))
			);

	create = (dto: R): Observable<R> =>
		this.http
			.post<APIResponse<R>>(this.root, dto)
			.pipe(catchError(this.catchError))
			.pipe(map(res => res.data as R));

	update = (uuid: string, dto: R): Observable<R | undefined> =>
		this.http
			.patch<APIResponse<R | void>>(this.specificURI(uuid), dto)
			.pipe(catchError(this.catchError))
			.pipe(map(res => res.data as R));

	delete = (uuid: string): Observable<void> =>
		this.http
			.delete<void>(this.specificURI(uuid))
			.pipe(catchError(this.catchError))
			.pipe(tap(() => console.warn(`Resource ${uuid} deleted with success`)));

	protected specificURI = (uuid: string): string => `${this.root}/${uuid}`;

	protected catchError = (
		err: HttpErrorResponse,
		caught: Observable<unknown>
	): Observable<any> => {
		// Check Content type

		// Check Status
		console.error('An error occured while requesting API: ', {
			err: err,
			caught,
		});
		return of(err);
	};
}
