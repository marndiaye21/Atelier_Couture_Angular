import { AbstractArticle} from "./AbstractArticle";
import { AbstractArticleData } from "./AbstractArticleData";
import { Provider } from "./Provider";

export interface Article extends AbstractArticle, AbstractArticleData {
    price: number;
    providers: Provider[]
}
