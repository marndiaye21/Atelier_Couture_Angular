import { Category } from "./Category";
import { Article } from "./Article";
import { Provider } from "./Provider";
import { Approvisionnement } from "./Approvisionnement";

export interface JsonResponse<T> {
    success: string;
    errors: Array<string>;
    data: T | Pagination<T>;
}

export interface Pagination<T> {
    data: T,
    total: number,
    per_page: number
}

export interface ArticleData<T> {
    categories: Category[];
    providers: Provider[];
    articles: Article[] | Pagination<T>;
    approvisionnements: Approvisionnement[];
}
