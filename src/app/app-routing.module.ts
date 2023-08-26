import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieComponent } from './components/categorie/categorie.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticleVenteComponent } from './components/article-vente/article-vente.component';

const routes: Routes = [
  {path: "", component: CategorieComponent},
  {path: "categories", component: CategorieComponent},
  {path: "articles-confection", component: ArticleComponent},
  {path: "articles-vente", component: ArticleVenteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
