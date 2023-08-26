import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { JsonResponse, Pagination } from 'src/app/models/JsonResponse';
import { CategoryService } from 'src/app/services/category.service';
import { environment } from 'src/environments/environment.development';

@Component({
	selector: 'app-categorie',
	templateUrl: './categorie.component.html',
	styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit, OnDestroy {
	categories: Category[] = [];
	currentPage: number = 1;
	perPage = 5;
	private totalPage!: number;
	pages: number[] = [];

	labelInput: string = "";
	labelExists = false;
	typeChecked = false;
	typeValue: string = "";
	labelInputInvalid = false;
	editChecked = false;
	allCategoriesChecked = false;
	editCategory: Category | null = null;
	categoriesToDelete: Category[] = <Category[]>{};
	input: boolean = false;
	imagePath = environment.storage;
	confirmDeleting: boolean = false;

	checkedCategories: number[] = [];

	constructor(private categoryService: CategoryService) { }

	ngOnInit(): void {
		this.loadCategories()
	}

	calculateTotalPage() {
		this.pages = [];
		for (let i = 1; i <= this.totalPage; i++) {
			this.pages.push(i);
		}
	}

	loadCategories() {
		this.categories = [];
		this.categoryService.paginate<Pagination<Category[]>>(this.perPage, this.currentPage).subscribe(
			(response: Pagination<Category[]>) => {
				if (Array.isArray(response.data)) {
					this.categories = response.data;
					this.totalPage = Math.ceil(response.total / response.per_page);
					this.calculateTotalPage()
				}
			},
			(error) => {
				console.log(error)
			}
		)
	}

	toggleMode() {
		if (this.editChecked) {
			this.allCategoriesChecked = false;
			this.checkedCategories = [];
		} else {
			this.labelInput = "";
			this.input = false;
		}
	}

	toggleCategoryType(event: HTMLInputElement) {
		this.typeChecked = true;
		this.typeValue = event.id
	}

	onCategoryChange(event: Event, category: Category) {
		if (event.target && "checked" in event.target) {
			if (event.target.checked) {
				this.checkedCategories.push(category.id as number)
			} else {
				this.checkedCategories.splice(this.checkedCategories.indexOf(category.id as number), 1);
				this.allCategoriesChecked = false;
			}

			if (this.checkedCategories.length == this.perPage) {
				this.allCategoriesChecked = true;
			}
		}
		console.log(this.checkedCategories);
	}

	checkAllCategories() {
		this.checkedCategories = [];
		if (this.allCategoriesChecked) {
			for (const category of this.categories) {
				this.checkedCategories.push(category.id as number);
			}
		}
	}

	onInputChange(): void {
		if (this.labelInput.length < 3 || this.labelInput.length === 0) {
			this.labelInputInvalid = true;
			return;
		}

		this.categoryService.search(this.labelInput).subscribe(
			(response: JsonResponse<Category[]>) => {
				if (Array.isArray(response.data)) {
					this.labelExists = response.data.length !== 0
				}
				this.labelInputInvalid = this.labelExists;
			}
		)
	}

	addCategory() {
		if (!this.editChecked) {
			this.categoryService.create({ "label": this.labelInput, type: this.typeValue }).subscribe(
				(response: JsonResponse<Category[]>) => {
					this.labelInput = "";
					if (Array.isArray(response.data)) {
						this.categories.unshift(response.data[0]);
					}
				}
			)
			return;
		}

		if (this.editCategory && "label" in this.editCategory) {
			this.editCategory.label = this.labelInput;
		}

		this.categoryService.update<Category>(this.editCategory?.id as number, this.editCategory as Category).subscribe(
			(response) => {
				this.labelInput = "";
				let categoryUpdated = this.categories.find(category => category.id == this.editCategory?.id);
				if (categoryUpdated && "label" in categoryUpdated) {
					categoryUpdated.label = this.editCategory?.label as string;
				}
				let indexCategoryUpdated = this.categories.indexOf(categoryUpdated as Category);
				this.categories.splice(indexCategoryUpdated, 1, categoryUpdated as Category);
				console.log(response);
			}
		)
	}

	updateCategoryMode(category: Category) {
		if (this.editChecked) {
			this.labelInput = category.label;
			this.editCategory = category;
			this.labelInputInvalid = true;
			this.labelExists = true;
			this.input = true;
			return;
		}

		this.editCategory = null;
	}

	deleteCategory() {
		if (this.editChecked) {
			this.categoryService.delete(0, { ids: this.checkedCategories }).subscribe(
				(response) => {
					this.categories = this.categories.filter(category => !this.checkedCategories.includes(category.id as number))
					this.confirmDeleting = false;
					console.log(response);
				}
			)
		}
	}

	onDeleteCategory() {
		this.confirmDeleting = true;
	}

	onCancelDeleting() {
		this.confirmDeleting = false;
	}

	onPageChanged(page: number) {
		if (page != this.currentPage) {
			this.resetCategorySelection()
		}
		this.currentPage = page;
		this.loadCategories();
	}

	resetCategorySelection() {
		this.allCategoriesChecked = false;
		this.checkedCategories = [];
	}

	ngOnDestroy() {
		//
	}
}
