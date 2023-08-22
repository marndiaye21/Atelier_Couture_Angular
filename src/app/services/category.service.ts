import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonResponse } from '../models/JsonResponse';
import { Category } from '../models/Category';
import { Observable } from 'rxjs';
import { Ids } from '../models/Ids';
import { environment } from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	private categoriesUrl = environment.api + "categories";

	constructor(private http: HttpClient) { }

	getCategories<T>(perPage?: number, page?: number): Observable<JsonResponse<T>> {
		if (page) {
			return this.http.get<JsonResponse<T>>(this.categoriesUrl +
				(perPage ? "?perPage=" + perPage : "") +
				(perPage ? "&page=" + page : "?page=" + page)
			);
		}
		return this.http.get<JsonResponse<T>>(
			this.categoriesUrl +
			(perPage ? "?perPage=" + perPage : "")
		);
	}

	searchCategory(searchValue: string): Observable<JsonResponse<Category[]>> {
		return this.http.get<JsonResponse<Category[]>>(this.categoriesUrl + "/search/" + searchValue);
	}

	lastArticleInCategory(category_id: number): Observable<JsonResponse<Category[]>> {
		return this.http.get<JsonResponse<Category[]>>(this.categoriesUrl + "/" + category_id);
	}

	addCategory(category: Category): Observable<JsonResponse<Category[]>> {
		return this.http.post<JsonResponse<Category[]>>(this.categoriesUrl, category);
	}

	editCategory(newCategory: Category) {
		return this.http.put(this.categoriesUrl + "/" + newCategory.id, newCategory);
	}

	deleteCategory(ids: Ids) {
		return this.http.delete(this.categoriesUrl + "/delete", {
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			body: ids
		});
	}
}
