import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

	@Input() currentPage: number = 1;
	@Input() pages: number[] = [];
	@Input() perPage: number = 5;
	@Input() totalPage: number = 0;
	
	@Output() pageChanged: EventEmitter<number> = new EventEmitter<number>;

	goToPage(pageNumber: number) {
		
		this.currentPage = pageNumber;
		this.pageChanged.emit(this.currentPage);
	}

	nextPage() {
		if (this.currentPage < this.pages.length) {
			this.currentPage++;
			this.pageChanged.emit(this.currentPage);
		}
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
			this.pageChanged.emit(this.currentPage);
		}
	}
}
