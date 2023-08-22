import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieComponent } from './components/categorie/categorie.component';
import { ArticleComponent } from './components/article/article.component';

const routes: Routes = [
  {path: "", component: CategorieComponent},
  {path: "categories", component: CategorieComponent},
  {path: "articles", component: ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
