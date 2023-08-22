import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/models/Article';

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent {

	@Output() deleteArticle: EventEmitter<number> = new EventEmitter<number>;
	@Output() editArticle: EventEmitter<Article> = new EventEmitter<Article>;
	@Input() articles!: Article[];
	@Input() loading : boolean = false;

	onDeleteArticle(articleId: number) {
		this.deleteArticle.emit(articleId);
	}

	onEditArticle(article: Article) {
		this.editArticle.emit(article);
	}
}
