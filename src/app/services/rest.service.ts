import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export abstract class RestService<T> {

	protected abstract uri(): string;

	constructor(private http: HttpClient) { }

	all<U>(withData?:string) : Observable<U> {
		return this.http.get<U>(`${environment.api}${this.uri()}${withData ? "?data=data" : ""}`).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	create<U>(body: U, id?: number) : Observable<T> {
		return this.http.post<T>(`${environment.api}${this.uri()}${id ? "/" + id : ""}`, body).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	update<U>(id: number, body: U): Observable<T> {
		return this.http.put<T>(`${environment.api}${this.uri()}/${id}`, body).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	find(id: number): Observable<T> {
		return this.http.get<T>(`${environment.api}${this.uri()}/${id}`).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	delete<U>(id: number, ids?: U): Observable<T> {
		return this.http.delete<T>(`${environment.api}${this.uri()}/${id}`, ids ? {body: ids} : {}).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	paginate<U>(perPage?: number, page?: number) : Observable<U> {
		if (page) {
			return this.http.get<U>(`${environment.api}${this.uri()}
				${(perPage ? "?perPage=" + perPage : "")}${(perPage ? "&page=" + page : "?page=" + page)}
			`).pipe(
				tap((response) => console.log(response)),
				catchError(error => this.handleError(error))
			);
		}
		return this.http.get<U>(`${environment.api}${this.uri()}${(perPage ? "?perPage=" + perPage : "")}`).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	search(searchValue: string): Observable<T> {
		return this.http.get<T>(`${environment.api}${this.uri()}/search/${searchValue}`).pipe(
			tap((response) => console.log(response)),
			catchError(error => this.handleError(error))
		);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
		  // A client-side or network error occurred. Handle it accordingly.
		  console.error('An error occurred:', error.error);
		} else {
		  // The backend returned an unsuccessful response code.
		  // The response body may contain clues as to what went wrong.
		  console.error(
			`Backend returned code ${error.status}, body was: `, error.error);
		}
		// Return an observable with a user-facing error message.
		return throwError(() => new Error("Quelque chose c'est mal passée; please try again later."));
	  }
}
