import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Article } from 'src/app/models/Article';
import { Category } from 'src/app/models/Category';
import { ArticleVenteData } from 'src/app/models/JsonResponse';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { environment } from 'src/environments/environment.development';

@Component({
	selector: 'app-form-article-vente',
	templateUrl: './form-article-vente.component.html',
	styleUrls: ['./form-article-vente.component.css']
})
export class FormArticleVenteComponent implements OnInit {
	articleVenteForm: FormGroup = <FormGroup>{};
	@Input("articleVenteDataForm") articleVenteData: ArticleVenteData = <ArticleVenteData>{};
	@Output() onAddArticleVente: EventEmitter<FormData> = new EventEmitter();
	searchArticleConfection: Article[] = <Article[]>[];
	storageImagePath: string = environment.storage;
	index: number = 0;
	stockQuantityValid: boolean = true;
	stockQuantityErrors: string[] = [];
	selectedArticleConfection: Article[] = <Article[]>[];
	costManufacturing: number = 0;

	categoryOrder: number = 0;
	selectedCategory: Category = <Category>{}
	defaultImgPath: string = "assets/default.jpg";
	imgPath: string = this.defaultImgPath;

	private errorMessages: any = {
		"label.required": "Le libellé de l'article est requis",
		"label.minlength": "Le libellé de l'article doit être au minimum 3 caractères",
		"sales_price.required": "Le prix de l'article est requis",
		"sales_price.min": "Le prix de l'article doit être positif",
		"sales_price.pattern": "Le prix de l'article doit être un entier",
		"stock.required": "La quantité de stock de l'article est requis",
		"stock.min": "La quantité de stock de l'article doit être positif",
		"category.required": "La catégorie de l'article est requis",
		"marge.required": "La marge de l'article est requis",
		"articles_confection.required": "Il nécéssaire de préciser les articles de confections"
	};

	constructor(private formBuilder: FormBuilder, private uploadImageService: UploadImageService) {
		this.articleVenteForm = this.formBuilder.group({
			label: this.formBuilder.control("", [Validators.required, Validators.minLength(3)]),
			sales_price: this.formBuilder.control("", [Validators.required, Validators.min(0), Validators.pattern("^[0-9]+$")]),
			category_id: this.formBuilder.control("", [Validators.required]),
			manufacturing_cost: "",
			marge: this.formBuilder.control("", {
				validators: [Validators.required],
				asyncValidators: [this.margeAsyncValidator(+this.costManufacturing)],
				updateOn: 'change'
			  }),
			promoCheckControl: this.formBuilder.control(false),
			promo: this.formBuilder.control("", [Validators.required]),
			articles_confection: this.formBuilder.array([], Validators.required),
			reference: this.formBuilder.control("Ref", [Validators.required]),
			photo: ""
		});
	}

	ngOnInit(): void {
		//
	}

	get label() {
		return this.articleVenteForm.controls['label'];
	}

	get sales_price() {
		return this.articleVenteForm.controls['sales_price'];
	}

	get promoCheck() {
		return this.articleVenteForm.controls['promoCheckControl'];
	}

	get marge() {
		return this.articleVenteForm.controls['marge'];
	}

	get category() {
		return this.articleVenteForm.controls['category_id'];
	}

	get articleConfection() {
		return this.articleVenteForm.controls['articles_confection'] as FormArray
	}

	get manufacturingCost() {
		return this.articleVenteForm.controls['manufacturing_cost']
	}

	get reference() {
		return this.articleVenteForm.controls['reference'];
	}

	get photo() {
		return this.articleVenteForm.controls['photo'];
	}

	onCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		let category = this.articleVenteData.categories_vente.find(cat => cat.id == +target.selectedOptions[0].value)
		this.selectedCategory = category as Category;
		this.generateRefernce();
		console.log(this.selectedCategory);
	}

	addArticleConfectionGroup() {
		this.articleConfection.push(this.formBuilder.group({
			id: 0,
			label: this.formBuilder.control("", [Validators.required]),
			stock: this.formBuilder.control("", [Validators.required]),
			price: this.formBuilder.control("", [Validators.required]),
		}));
	}

	onArticleConfectionStockInput() {
		this.manufacturingCost.setValue(this.calculateManufacturingCost());
		this.costManufacturing = +this.manufacturingCost.value
	}

	calculateManufacturingCost() {
		let manufacturingCostTotal = 0;
		this.articleConfection.controls.forEach(article => {
			if (article.value.stock) {
				manufacturingCostTotal += article.value.price * article.value.stock
			}
		});
		return manufacturingCostTotal;
	}

	onArticleConfectionLabelInput(event: Event, index: number) {
		this.index = index
		const target = event.target as HTMLInputElement;
		this.searchArticleConfection = [];
		if (target.value.length) {
			this.searchArticleConfection = this.articleVenteData.articles_confection.filter(
				articleConf => articleConf.label.toLocaleLowerCase().includes(target.value.toLocaleLowerCase())
			);
		}
	}

	selectArticleConfection(article_confection: Article) {
		this.selectedArticleConfection.push(article_confection);
		this.articleConfection.at(this.index).patchValue({
			label: article_confection.label, price: article_confection.price, id: article_confection.id
		})
		this.searchArticleConfection = [];
	}

	clearSearchArticleConfection() {
		this.searchArticleConfection = [];
	}

	removeArticleConfectionAt(index: number) {
		let label = this.articleConfection.at(index).get('label')?.value
		this.selectedArticleConfection = this.selectedArticleConfection.filter(
			article => article.label.toLowerCase() != label.toLowerCase()
		);
		this.articleConfection.at(index).reset();
	}

	onClickDeleteArticleConfection(index: number) {
		this.removeArticleConfectionAt(index);
		this.articleConfection.removeAt(index);
	}

	onMargeChange() {
		this.marge.setAsyncValidators(this.margeAsyncValidator(this.costManufacturing));
		this.sales_price.setValue(+this.marge.value + (+this.costManufacturing));
	}

	onInputFileChange(fileInput: HTMLInputElement) {
		if (fileInput.files) {
			this.photo.setValue(fileInput.files[0]);
			this.uploadImageService.displayImage(fileInput.files[0]).then(base64Img => {
				this.imgPath = base64Img ?? this.defaultImgPath;
			});
		}
	}

	generateRefernce() {
		this.reference.setValue('REF' + 
			(this.label.value.length >= 3 ? '-' + this.label.value.slice(0, 3) : '') + 
			(this.selectedCategory.label ? '-' + this.selectedCategory.label : '') +
			(this.selectedCategory.order != undefined ? '-' + (+this.selectedCategory.order + 1) : '')
		)
	}

	getErrorMessages(fieldName: string, errors: ValidationErrors): string {
		return this.errorMessages[fieldName + "." + Object.keys(errors)[0]];
	}

	margeAsyncValidator(manufacturingCost: number): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (+control.value >= 5000 && +control.value <= manufacturingCost / 3) {
				return of(null);
			} else {
				return of({ margevalidator: true });
			}
		};
	}

	onSubmit() {
		const formData = new FormData;
		for (const [constrolName, constrolValue] of Object.entries(this.articleVenteForm.controls)) {
			if (constrolName == "articles_confection") {
				let confectionControls = constrolValue as FormArray
				confectionControls.controls.forEach(control => {
					formData.append(`articles_confection[${control.value.id}]`, control.value.stock);
				});
			} else {
				formData.append(constrolName, constrolValue.value);
			}
		}

		this.onAddArticleVente.emit(formData);
	}
}
