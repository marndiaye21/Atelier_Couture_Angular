import { Category } from "./Category";
import { Provider } from "./Provider";

export interface JsonResponse<T> {
    success: string;
    errors: Array<string>;
    data: T | Pagination<T>;
}

export interface Pagination<T> {
    data: T,
    total: number,
    per_page: number,
    pages: number[]
}

export interface ArticleData {
    categories: Category[];
    providers: Provider[];
}
