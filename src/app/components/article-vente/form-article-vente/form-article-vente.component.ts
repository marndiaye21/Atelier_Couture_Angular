import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Article } from 'src/app/models/Article';
import { ArticleVente } from 'src/app/models/ArticleVente';
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
	@Output() onArticleVenteLabelChange: EventEmitter<string> = new EventEmitter();
	searchArticleConfection: Article[] = <Article[]>[];
	storageImagePath: string = environment.storage;
	index: number = 0;
	selectedArticleConfection: Article[] = <Article[]>[];
	labelArticleVenteExiste: boolean = false;

	selectedCategory: Category = <Category>{}
	articleVenteToEdit: ArticleVente|null = <ArticleVente>{};
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
			marge: this.formBuilder.control("", [Validators.required, this.margeValidator()]),
			promoCheckControl: this.formBuilder.control(false),
			promo: "",
			articles_confection: this.formBuilder.array([], Validators.required),
			reference: this.formBuilder.control("Ref", [Validators.required]),
			photo: ["", Validators.required]
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

	get promo() {
		return this.articleVenteForm.controls['promo'];
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

	onArticleVenteInput() {
		this.generateRefernce();
		if (this.label.value.length >= 3) {
			this.onArticleVenteLabelChange.emit(this.label.value);
		}
	}

	onCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		let category = this.articleVenteData.categories_vente.find(cat => cat.id == +target.selectedOptions[0].value)
		this.selectedCategory = category as Category;
		this.generateRefernce();
	}

	addArticleConfectionGroup() {
		for (const control of this.articleConfection.controls) {
			if (control.get('label')?.value == "" || control.get('stock')?.value == "") {
				return;
			}
		}

		this.articleConfection.push(this.formBuilder.group({
			id: 0,
			label: this.formBuilder.control("", [Validators.required]),
			stock: this.formBuilder.control({ value: "", disabled: true }, [Validators.required]),
			price: this.formBuilder.control("", [Validators.required]),
			category: "",
		}));
		this.observeNewArticleGroup();
	}

	observeNewArticleGroup() {
		this.articleConfection.at(this.articleConfection.controls.length - 1).get('label')?.valueChanges.subscribe((value) => {
			let found = this.selectedArticleConfection.find(article => article.label == value);
			if (!value || !found) {
				this.articleConfection.at(this.articleConfection.controls.length - 1).get('stock')?.reset();
				this.manufacturingCost.reset();
				this.sales_price.reset();
				this.articleConfection.at(this.articleConfection.controls.length - 1).get('stock')?.disable();
				return;
			}

			this.articleConfection.at(this.articleConfection.controls.length - 1).get('stock')?.enable();
		})
	}

	onArticleConfectionStockInput() {
		this.manufacturingCost.setValue(this.calculateManufacturingCost());
	}

	calculateManufacturingCost() {
		let manufacturingCostTotal = 0;
		this.articleConfection.controls.forEach(article => {
			if (article.value.stock && !isNaN(article.value.stock)) {
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
				articleConf => articleConf.label.toLowerCase().includes(target.value.toLowerCase())
			);
		}
	}

	selectArticleConfection(article_confection: Article) {
		this.selectedArticleConfection.push(article_confection);
		this.articleConfection.at(this.index).patchValue({ ...article_confection, stock: "" })
		this.searchArticleConfection = [];
		this.manufacturingCost.setValue(this.calculateManufacturingCost());
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
		this.manufacturingCost.setValue(this.calculateManufacturingCost());
	}

	onMargeChange() {
		this.sales_price.reset();
		if (this.marge.valid) {
			this.sales_price.setValue(+this.marge.value + (+this.manufacturingCost.value));
		}
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

	margeValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (+control.value >= 5000 && +control.value <= this.manufacturingCost.value / 3) {
				return null;
			} else {
				return { margevalidator: true };
			}
		};
	}

	articleConfectionHasType(categoryType: string) {
		return this.articleConfection.controls.some(control => control.value.category.label.toLowerCase() == categoryType);
	}

	fillForm(articleVente: ArticleVente) {
		this.articleVenteForm.patchValue({ ...articleVente, category_id: articleVente.category.id });
		this.imgPath = environment.storage + articleVente.photo;
		this.articleConfection.clear();
		articleVente.articles_confection.forEach(article => {
			this.articleConfection.push(this.formBuilder.group({
				id: 0,
				label: this.formBuilder.control(article.label, [Validators.required]),
				stock: this.formBuilder.control(article.pivot.article_confection_quantity, [Validators.required]),
				price: this.formBuilder.control(article.price, [Validators.required]),
				category: article.category.label,
			}));
			this.observeNewArticleGroup();
		})
	}

	resetForm() {
		this.articleVenteForm.reset();
		this.articleConfection.clear();
		this.imgPath = this.defaultImgPath;
	}

	onSubmit() {
		if (!this.articleConfectionHasType("tissu") || !this.articleConfectionHasType("fil") || !this.articleConfectionHasType("bouton")) {
			return;
		}

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
