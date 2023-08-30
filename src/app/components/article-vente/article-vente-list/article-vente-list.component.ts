import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleVente } from 'src/app/models/ArticleVente';

@Component({
	selector: 'app-article-vente-list',
	templateUrl: './article-vente-list.component.html',
	styleUrls: ['./article-vente-list.component.css']
})
export class ArticleVenteListComponent implements OnInit {
	@Input() articleVente: ArticleVente[] = <ArticleVente[]>[];
	@Output() onUpdateArticle: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();
	@Output() onDeleteArticle: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();

	ngOnInit(): void {
		//
	}

	onUpdateArticleVente(articleVente: ArticleVente) {
		this.onUpdateArticle.emit(articleVente);
	}

	onDeleteArticleVente(articleVente: ArticleVente) {
		this.onDeleteArticle.emit(articleVente);
	}
}
