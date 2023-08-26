import { AbstractArticleData } from "./AbstractArticleData";
import { Article } from "./Article";

export interface ArticleVente extends AbstractArticleData {
    sales_price: number,
    marge: number,
    manufacturing_cost: number,
    promo: number,
    articles_confection: Article[]
}