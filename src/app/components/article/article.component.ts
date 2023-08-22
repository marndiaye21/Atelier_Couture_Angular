import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Approvisionnement } from 'src/app/models/Approvisionnement';
import { Article } from 'src/app/models/Article';
import { Category } from 'src/app/models/Category';
import { ArticleData, JsonResponse, Pagination } from 'src/app/models/JsonResponse';
import { Provider } from 'src/app/models/Provider';
import { ArticleService } from 'src/app/services/article.service';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css']
})
export class ArticleComponent {

    articles: Article[] = [];
    categories: Category[] = [];
    providers: Provider[] = [];
    approvisionnements: Approvisionnement[] = [];
    articleToEdit!: Article;
    editMode = false;
    loading: boolean = false;

    currentPage: number = 1;
    perPage = 5;
    private totalPage!: number;
    pages: number[] = [];

    lastId: number = 0;
    articleExists: boolean = false;
    articleAdded: boolean = false;

    constructor(private articleService: ArticleService) { }

    ngOnInit() {
        this.loadArticles();
    }

    calculateTotalPage() {
        this.pages = [];
        for (let i = 1; i <= this.totalPage; i++) {
            this.pages.push(i);
        }
    }

    loadArticles() {
        this.articleService
            .getArticles<JsonResponse<ArticleData<Article[]>>>(this.perPage, this.currentPage, true)
            .subscribe(this.articleListObserver);
    }

    onCategoryChange(category: Category) {
        if (this.editMode && category.id == this.articleToEdit.category.id) {
            this.lastId = category.order
            return
        }
        this.lastId = category.order + 1
    }

    onInputArticleLabel(value: string) {
        if (value.length < 3) {
            return;
        }
        this.articleService.searchArticle(value).subscribe((response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data) && response.data.length) {
                this.articleExists = true
            } else {
                this.articleExists = false;
            }
        })
    }

    onPageChanged(page: number) {
        this.articleService.getArticles<JsonResponse<Pagination<Article[]>>>(this.perPage, page, false).subscribe(
            (response: JsonResponse<Pagination<Article[]>>) => {
                this.articles = response.data.data as Article[]
            });
    }

    addNewArticle(formData: FormData) {
        if (this.editMode) {
            this.articleService.editArticle(this.articleToEdit.id as number, formData).subscribe(this.articleEditObserver);
            return;
        }
        this.articleService.addArticle(formData).subscribe(this.articleAddObserver)
    }

    onDeleteArticle(articleId: number) {
        this.articleService.deleteArticle(articleId).subscribe(
            (response: JsonResponse<number>) => {
                let foundArticle = this.articles.find(article => article.id == articleId);
                let indexOfFoundArticle = this.articles.indexOf(foundArticle as Article);
                this.articles.splice(indexOfFoundArticle, 1);
            }
        )
    }

    onEditArticle(article: Article) {
        this.articleToEdit = article;
        this.editMode = true;
    }

    attachProviders(providers: Provider[]) {
        for (const provider of providers) {
            this.approvisionnements.push({
                id: this.approvisionnements[this.approvisionnements.length - 1].id + 1,
                article_id: provider.pivot.article_id,
                provider_id: provider.pivot.provider_id
            });
        }
    }

    detachProviders(providers: Provider[]) {
        this.approvisionnements = this.approvisionnements.filter(appro => appro.article_id != providers[0].pivot.article_id);
    }

    syncProviders(providers: Provider[]) {
        this.detachProviders(providers);
        this.attachProviders(providers);
    }

    /*---------------------------------------------- Observers ----------------------------------------------*/

    articleEditObserver = {
        next: (response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data)) {
                let articleEdited = response.data[0];
                let foundEditedArticle = this.articles.find(article => article.id == this.articleToEdit.id);
                let indexArticleEdited = this.articles.indexOf(foundEditedArticle as Article);
                this.articles.splice(indexArticleEdited, 1, articleEdited);
                this.editMode = false;
                this.syncProviders(response.data[0].providers);
            }
            this.articleAdded = true;
            setTimeout(() => {
                this.articleAdded = false;
            }, 1000);
        }
    }

    articleAddObserver = {
        next: (response: JsonResponse<Article[]>) => {
            if (Array.isArray(response.data)) {
                this.articles.unshift(response.data[0]);
                this.attachProviders(response.data[0].providers);
            }
            this.articleAdded = true;
            setTimeout(() => {
                this.articleAdded = false;
            }, 1000);
        },
        error: (error: HttpErrorResponse) => {
            console.log(error);
        }
    }

    articleListObserver = {
        next: (response: JsonResponse<ArticleData<Article[]>>) => {
            this.loading = true;
            if (
                "providers" in response.data && "categories" in response.data &&
                "articles" in response.data && "approvisionnements" in response.data
            ) {
                this.providers = response.data.providers
                this.categories = response.data.categories
                this.approvisionnements = response.data.approvisionnements
                if ("data" in response.data.articles) {
                    this.articles = response.data.articles.data
                    this.totalPage = Math.ceil(response.data.articles.total / response.data.articles.per_page);
                    this.calculateTotalPage();
                }
            }
        },
        error: (error: HttpErrorResponse) => {
            console.log(error);
        },
        complete: () => {
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        }
    }
}
