import { Category } from "./Category";
import { Provider } from "./Provider";

export interface Article {
    id?: number;
    label: string;
    price: number;
    stock: string;
    category: Category;
    reference: string;
    photo: string;
    providers: Provider[]
}
