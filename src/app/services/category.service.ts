import { Injectable } from '@angular/core';
import { JsonResponse } from '../models/JsonResponse';
import { Category } from '../models/Category';
import { RestService } from './rest.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService extends RestService<JsonResponse<Category[]>> {

	protected override uri(): string {
		return "categories";
	}
}
