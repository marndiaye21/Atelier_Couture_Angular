import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class ProviderService {

	private url = environment.api + "providers";

	constructor(private http: HttpClient) { }

}
