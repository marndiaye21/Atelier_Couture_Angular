import { Component, Input, OnInit } from '@angular/core';
import { ArticleVente } from 'src/app/models/ArticleVente';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-article-vente-list',
  templateUrl: './article-vente-list.component.html',
  styleUrls: ['./article-vente-list.component.css']
})
export class ArticleVenteListComponent implements OnInit {
 @Input() articleVente: ArticleVente[] = <ArticleVente[]>[];
 imagePath: string = environment.storage
 
 ngOnInit(): void {
 }
}
