import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Article } from 'src/app/models/Article';
import { Category } from 'src/app/models/Category';
import { ArticleData, JsonResponse, Pagination } from 'src/app/models/JsonResponse';
import { ArticleService } from 'src/app/services/article.service';
import { FormArticleComponent } from './form-article/form-article.component';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css']
})
export class ArticleComponent {

    articleData: ArticleData = <ArticleData>{}
    response: Pagination<Article[]> = <Pagination<Article[]>>{}
    editMode = false;
    loading: boolean = false;

	@ViewChild(FormArticleComponent, {static: false}) formComponent!: FormArticleComponent;

    lastId: number = 0;
    articleExists: boolean = false;

    constructor(private articleService: ArticleService) { }

    ngOnInit() {
        this.loadArticles();
    }

    calculateTotalPage() {
        this.response.pages = [];
        for (let i = 1; i <= this.response.total; i++) {
            this.response.pages.push(i);
        }
    }

    loadArticles() {
        this.articleService
            .all<JsonResponse<ArticleData>>("data")
            .subscribe({
                next: (response: JsonResponse<ArticleData>) => {
                    this.articleData = response.data as ArticleData
                }
            });
        this.articleService.paginate<Pagination<Article[]>>(this.response.per_page ?? 5).subscribe(this.articleListObserver);
    }

    onCategoryChange(category: Category) {
        if (this.editMode && category.id == this.formComponent.articleToEdit.category.id) {
            this.lastId = category.order
            return
        }
        this.lastId = category.order + 1
    }

    onInputArticleLabel(value: string) {
        if (value.length < 3) {
            return;
        }
        this.articleService.search(value).subscribe((response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data) && response.data.length) {
                this.articleExists = true
            } else {
                this.articleExists = false;
            }
        })
    }

    onPageChanged(page: number) {
        this.articleService.paginate<Pagination<Article[]>>(this.response.per_page, page).subscribe(this.articleListObserver);
    }

    addNewArticle(formData: FormData) {
        if (this.editMode) {
            formData.append("_method", "PUT");
            this.articleService.create<FormData>(formData, this.formComponent.articleToEdit.id as number).subscribe(this.articleEditObserver);
            return;
        }
        this.articleService.create(formData).subscribe(this.articleAddObserver)
    }

    onDeleteArticle(articleId: number) {
        this.articleService.delete<JsonResponse<number>>(articleId).subscribe(
            (response: JsonResponse<Article[]>) => {
                let foundArticle = this.response.data.find(article => article.id == articleId);
                let indexOfFoundArticle = this.response.data.indexOf(foundArticle as Article);
                this.response.data.splice(indexOfFoundArticle, 1);
            }
        )
    }

    onEditArticle(article: Article) {
        this.formComponent.fillArticleForm(article);
        this.editMode = true;
    }

    /*---------------------------------------------- Observers ----------------------------------------------*/

    articleEditObserver = {
        next: (response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data)) {
                let articleEdited = response.data[0];
                console.log(response.data);
                let foundEditedArticle = this.response.data.find(article => article.id == this.formComponent.articleToEdit.id);
                let indexArticleEdited = this.response.data.indexOf(foundEditedArticle as Article);
                this.response.data.splice(indexArticleEdited, 1, articleEdited);
                this.editMode = false;
            }
            this.formComponent.resetForm();
        }
    }

    articleAddObserver = {
        next: (response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data)) {
                this.response.data.unshift(response.data[0]);
            }
            this.formComponent.resetForm();
        },
        error: (error: HttpErrorResponse) => {
            console.log(error);
        }
    }

    articleListObserver = {
        next: (response: Pagination<Article[]>) => {
            this.loading = true;
            this.response.data = response.data
            this.response.total = Math.ceil(response.total / response.per_page);
            this.response.per_page = response.per_page;
            this.calculateTotalPage();
            
        },
        error: (error: HttpErrorResponse) => {
            console.log(error);
        },
        complete: () => {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    }
}
