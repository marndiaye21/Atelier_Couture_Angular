import { AbstractArticle} from "./AbstractArticle";
import { Article } from "./Article";

export interface Category extends AbstractArticle {
    order: number,
    type: string,
    articles?: Article[]
}
