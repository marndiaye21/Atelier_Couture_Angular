import { AbstractArticle } from "./AbstractArticle";
import { Category } from "./Category";

export interface AbstractArticleData extends AbstractArticle {
    stock: string;
    category: Category;
    reference: string;
    photo: string;
}