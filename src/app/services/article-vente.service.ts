import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { ArticleVente } from '../models/ArticleVente';
import { JsonResponse } from '../models/JsonResponse';

@Injectable({
  providedIn: 'root'
})
export class ArticleVenteService extends RestService<JsonResponse<ArticleVente[]>> {

  protected override uri(): string {
    return "articles_vente";
  }
}
