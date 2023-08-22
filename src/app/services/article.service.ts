import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../models/JsonResponse';
import { Article } from '../models/Article';
import { environment } from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class ArticleService {

	private url = environment.api + "articles";

	constructor(private http: HttpClient) { }

	getArticles<T>(perPage?: number, page?: number, articleData?: boolean): Observable<T> {
		if (page) {
			return this.http.get<T>(`${this.url}?perPage=${perPage}&page=${page}${articleData ? "&article_data=" + "article_data" : ""}`);
		}
		return this.http.get<T>(this.url + "?perPage=" + perPage);
	}
	
	addArticle(data: FormData): Observable<JsonResponse<Article[]>> {
		return this.http.post<JsonResponse<Article[]>>(this.url, data);
	}

	searchArticle(label: string): Observable<JsonResponse<Article[]>> {
		return this.http.get<JsonResponse<Article[]>>(this.url + "/search/" + label);
	}

	deleteArticle(articleId: number): Observable<JsonResponse<number>> {
		return this.http.delete<JsonResponse<number>>(this.url + "/" + articleId);
	}

	editArticle(articleId: number, data: FormData): Observable<JsonResponse<Article[]>> {
		data.append('_method', "PUT");
		return this.http.post<JsonResponse<Article[]>>(`${this.url}/${articleId}`, data);
	}
}
