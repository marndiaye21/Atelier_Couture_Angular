import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleVente } from 'src/app/models/ArticleVente';
import { environment } from 'src/environments/environment.development';

@Component({
	selector: 'app-article-vente-item',
	templateUrl: './article-vente-item.component.html',
	styleUrls: ['./article-vente-item.component.css']
})
export class ArticleVenteItemComponent {
	@Input() articleVente: ArticleVente = <ArticleVente>{};
	imagePath: string = environment.storage
	@Output() onUpdateArticle: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();
	@Output() onDeleteArticle: EventEmitter<ArticleVente> = new EventEmitter<ArticleVente>();

	onUpdateArticleVente() {
		this.onUpdateArticle.emit(this.articleVente);
	}

	onDeleteArticleVente() {
		this.onDeleteArticle.emit(this.articleVente);
	}
}
