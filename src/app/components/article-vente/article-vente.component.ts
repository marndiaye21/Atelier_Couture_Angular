import { Component, OnInit } from '@angular/core';
import { ArticleVente } from 'src/app/models/ArticleVente';
import { Pagination } from 'src/app/models/JsonResponse';
import { ArticleVenteService } from 'src/app/services/article-vente.service';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})
export class ArticleVenteComponent implements OnInit {
  response: Pagination<ArticleVente[]> = <Pagination<ArticleVente[]>>{};

  constructor(private articleVenteService: ArticleVenteService){}

  ngOnInit(): void {
      this.articleVenteService.paginate<Pagination<ArticleVente[]>>(this.response.per_page ?? 5).subscribe(
        {
          next: (response) => {
              this.response = response
          },
        }
      );
  }
}
