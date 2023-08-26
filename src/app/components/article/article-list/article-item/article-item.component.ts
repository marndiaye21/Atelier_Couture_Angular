import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/models/Article';
import { environment } from 'src/environments/environment.development';

@Component({
	selector: 'app-article-item',
	templateUrl: './article-item.component.html',
	styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent {
	
	@Input() article!: Article;
	@Output() deleteArticle: EventEmitter<number> = new EventEmitter<number>;
	@Output() editArticle: EventEmitter<Article> = new EventEmitter<Article>;

	confirmDeleted = false;
	timer: number = 0;
	imgPath: string = environment.storage;

	confirmDeleting() {
		this.confirmDeleted = true;
		this.timer = 3;
		let t = setInterval(() => this.timer--, 1000);
		setTimeout(() => {
			this.confirmDeleted = false;
			clearInterval(t);
		}, 3000);
	}

	onDeleteArticle(articleId: number) {
		this.deleteArticle.emit(articleId);
	}

	onEditArticle() {
		console.log(this.article);
		this.editArticle.emit(this.article);
	}
}
