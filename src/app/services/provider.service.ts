import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../models/JsonResponse';
import { Provider } from '../models/Provider';
import { environment } from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class ProviderService {

	private url = environment.api + "providers";

	constructor(private http: HttpClient) { }

	getProviders(perPage?: number) : Observable<JsonResponse<Provider[]>> {
		return this.http.get<JsonResponse<Provider[]>>(this.url);
	}

	searchCategory(searchValue: string) : Observable<JsonResponse<Provider[]>> {
		return this.http.get<JsonResponse<Provider[]>>(this.url + "/search/" + searchValue);
	}
}
