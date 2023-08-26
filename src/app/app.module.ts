import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategorieComponent } from './components/categorie/categorie.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ArticleComponent } from './components/article/article.component';
import { FormArticleComponent } from './components/article/form-article/form-article.component';
import { ArticleListComponent } from './components/article/article-list/article-list.component';
import { ArticleItemComponent } from './components/article/article-list/article-item/article-item.component';
import { AlertComponent } from './components/alert/alert.component';
import { ArticleVenteComponent } from './components/article-vente/article-vente.component';
import { ArticleVenteListComponent } from './components/article-vente/article-vente-list/article-vente-list.component';
import { ArticleVenteItemComponent } from './components/article-vente/article-vente-list/article-vente-item/article-vente-item.component';
import { FormArticleVenteComponent } from './components/article-vente/form-article-vente/form-article-vente.component';

@NgModule({
  declarations: [
    AppComponent,
    CategorieComponent,
    TopBarComponent,
    PaginationComponent,
    ArticleComponent,
    FormArticleComponent,
    ArticleListComponent,
    ArticleItemComponent,
    AlertComponent,
    ArticleVenteComponent,
    ArticleVenteListComponent,
    ArticleVenteItemComponent,
    FormArticleVenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
