import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Article } from 'src/app/models/Article';
import { Category } from 'src/app/models/Category';
import { ArticleData } from 'src/app/models/JsonResponse';
import { Provider } from 'src/app/models/Provider';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { environment } from 'src/environments/environment.development';

@Component({
	selector: 'app-form-article',
	templateUrl: './form-article.component.html',
	styleUrls: ['./form-article.component.css']
})
export class FormArticleComponent implements OnInit {

	articleForm!: FormGroup;
	selectedProviders: Provider[] = [];
	@Input() articleData : ArticleData = <ArticleData>{}
	@Input() providersToChoice: Provider[] = [];
	selectedCategory: string = "";
	@Input() lastestId: number = 0;
	defaultImgPath: string = "assets/default.jpg";
	imgPath: string = this.defaultImgPath;
	image!: File;
	@Input() articleExists: boolean = false;
	@Input() editMode = false;
	articleToEdit!: Article;
	@Input() modifiedArticle: FormData = new FormData;

	@Output() addNewArticle: EventEmitter<FormData> = new EventEmitter<FormData>;
	@Output() categoryChange: EventEmitter<Category> = new EventEmitter<Category>;
	@Output() inputArticleLabel: EventEmitter<string> = new EventEmitter<string>;

	private errorMessages: any = {
		"label.required": "Le libellé de l'article est requis",
		"label.minlength": "Le libellé de l'article doit être au minimum 3 caractères",
		"price.required": "Le prix de l'article est requis",
		"price.min": "Le prix de l'article doit être positif",
		"price.pattern": "Le prix de l'article doit être un entier",
		"stock.required": "La quantité de stock de l'article est requis",
		"stock.min": "La quantité de stock de l'article doit être positif",
		"category.required": "La catégorie de l'article est requis"
	};

	constructor(private formBuilder: FormBuilder, private uploadImageService: UploadImageService) { }

	ngOnInit(): void {
		this.articleForm = this.formBuilder.group({
			"label": this.formBuilder.control("", [Validators.required, Validators.minLength(3)]),
			"price": this.formBuilder.control("", [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+$")]),
			"stock": this.formBuilder.control("", [Validators.required, Validators.min(0)]),
			"category": this.formBuilder.control("", [Validators.required]),
			"provider": this.formBuilder.control("")
		});
	}

	fillArticleForm(article: Article) {
		this.articleToEdit = article;
		this.selectedProviders = [];
		this.articleForm.patchValue({ label: article.label, price: article.price, stock: article.stock, category: article.category.id });
		this.lastestId = article.category.order;
		this.selectedCategory = article.category.label;
		this.selectedProviders = [...article.providers];
		this.lastestId = article.category.order;
		this.imgPath = environment.storage + article.photo
	}

	onInputArticle(event: Event): void {
		let element = event.target as HTMLInputElement;
		let value = element.value;
		if (!value.length) {
			this.articleExists = false;
		}
		this.inputArticleLabel.emit(value);
	}

	searchProviders(): void {
		const searchKey = this.articleForm.value.provider;
		if (searchKey == "") {
			this.providersToChoice = [];
			return;
		}
		let selectedProvidersId = this.selectedProviders.map(p => p.id);
		this.providersToChoice = this.articleData.providers.filter(provider => {
			return !selectedProvidersId.includes(provider.id) && provider.fullname.toLowerCase().includes(searchKey.toLowerCase())
		});
	}

	get label() {
		return this.articleForm.controls['label'];
	}

	get price() {
		return this.articleForm.controls['price'];
	}

	get stock() {
		return this.articleForm.controls['stock'];
	}

	get category() {
		return this.articleForm.controls['category'];
	}

	getErrorMessages(fieldName: string, errors: ValidationErrors): string {
		return this.errorMessages[fieldName + "." + Object.keys(errors)[0]];
	}

	unCheckedProvider(checkProvider: number) {
		let foundProvider = this.selectedProviders.find(provider => provider.id == checkProvider);
		if (foundProvider) {
			let providerIndex = this.selectedProviders.indexOf(foundProvider);
			this.selectedProviders.splice(providerIndex, 1);
		}
	}

	selectProvider(provider: Provider) {
		this.selectedProviders.push(provider);
		this.providersToChoice = [];
		this.articleForm.get('provider')?.setValue("");
	}

	onCategoryChange(event: Event) {
		const element = event.target as HTMLSelectElement
		if (element.value == "") {
			this.selectedCategory = "";
			return;
		}

		this.categoryChange.emit({
			id: +element.selectedOptions[0].value,
			label: element.selectedOptions[0].innerText,
			order: +element.selectedOptions[0].id,
			type: ""
		});
		this.selectedCategory = element.selectedOptions[0].innerText;
	}

	resetForm() {
		this.selectedProviders = [];
		this.selectedCategory = "";
		this.imgPath = this.defaultImgPath;
		this.articleForm.reset({label: "", stock: "", price: "", category: ""});
	}

	onInputFileChange(fileInput: HTMLInputElement) {
		if (fileInput.files) {
			this.uploadImageService.displayImage(fileInput.files[0]).then(base64Img => {
				this.imgPath = base64Img ?? this.defaultImgPath;
			});
		}
	}

	handleChangeData(fieldName: string, newValue: any) {
		if (newValue != Object(this.articleToEdit)[fieldName]) {
			this.modifiedArticle.append(fieldName, newValue);
		} else {
			this.modifiedArticle.delete(fieldName);
		}
	}

	handleChangeProvider() {
		let providersSelected = this.selectedProviders.map(provider => provider.id);
		let providerToEdit = this.articleToEdit.providers.map(providerItem => providerItem.id);
		
		let same = this.articleToEdit.providers
			.every(provider => providersSelected.includes(provider.id)) && providersSelected
			.every(provider => providerToEdit.includes(provider as number));
		if (same) {
			return;
		}
		if ("providers" in this.modifiedArticle) {
			this.modifiedArticle.delete('providers')
		}
		this.modifiedArticle.append("providers", this.selectedProviders.map(provider => provider.id).join());
	}

	submit() {
		if (this.editMode) {
			this.handleChangeData('label', this.articleForm.value.label);
			this.handleChangeData('price', this.articleForm.value.price);
			this.handleChangeData('stock', this.articleForm.value.stock);
			if (this.articleForm.value.category != this.articleToEdit.category.id) {
				this.modifiedArticle.append("category_id", this.articleForm.value.category);
			} else {
				this.modifiedArticle.delete("category_id");
			}
			let ref = 'REF-' + this.articleForm.value.label + '-' + this.selectedCategory + '-' + this.lastestId;
			if (this.articleToEdit.reference != ref) {
				if ("reference" in this.modifiedArticle) {
					this.modifiedArticle.delete("reference");
				} else {
					this.modifiedArticle.append("reference", ref);
				}
			}
			if (this.image) {
				this.modifiedArticle.append('photo', this.image);
			}
			this.handleChangeProvider();
			console.log(this.modifiedArticle);
			
			this.addNewArticle.emit(this.modifiedArticle);
			return;
		}
		const formData = new FormData();
		formData.append("label", this.articleForm.value.label);
		formData.append("price", this.articleForm.value.price);
		formData.append("stock", this.articleForm.value.stock);
		formData.append("category_id", this.articleForm.value.category);
		formData.append("reference", 'REF-' + this.articleForm.value.label + '-' + this.selectedCategory + '-' + this.lastestId);
		if (this.image) {
			formData.append("photo", this.image, this.image.name);
		}
		let p = this.selectedProviders.map(provider => provider.id).join(",");
		formData.append("providers", p);
		formData.append("order", this.lastestId.toString());
		this.addNewArticle.emit(formData);
	}
}
