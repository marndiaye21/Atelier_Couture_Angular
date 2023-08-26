import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVenteListComponent } from './article-vente-list.component';

describe('ArticleVenteListComponent', () => {
  let component: ArticleVenteListComponent;
  let fixture: ComponentFixture<ArticleVenteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleVenteListComponent]
    });
    fixture = TestBed.createComponent(ArticleVenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
