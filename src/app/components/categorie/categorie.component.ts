import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { JsonResponse, Pagination } from 'src/app/models/JsonResponse';
import { CategoryService } from 'src/app/services/category.service';

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
	labelInputInvalid = false;
	editChecked = false;
	allCategoriesChecked = false;
	editCategory: Category | null = null;
	input: boolean = false;

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
		this.categoryService.getCategories<Pagination<Category[]>>(this.perPage, this.currentPage).subscribe(
			(response: JsonResponse<Pagination<Category[]>>) => {
				if (Array.isArray(response.data.data)) {
					this.categories = response.data.data;
					this.totalPage = Math.ceil(response.data.total / response.data.per_page);
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

		this.categoryService.searchCategory(this.labelInput).subscribe(
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
			this.categoryService.addCategory({ "label": this.labelInput, order: 0 }).subscribe(
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

		this.categoryService.editCategory(this.editCategory as Category).subscribe(
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
			this.categoryService.deleteCategory({ ids: this.checkedCategories }).subscribe(
				(response) => {
					this.categories = this.categories.filter(category => !this.checkedCategories.includes(category.id as number))
					console.log(response);
				}
			)
		}
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
