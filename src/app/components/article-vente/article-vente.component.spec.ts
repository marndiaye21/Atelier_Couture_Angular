import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVenteComponent } from './article-vente.component';

describe('ArticleVenteComponent', () => {
  let component: ArticleVenteComponent;
  let fixture: ComponentFixture<ArticleVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleVenteComponent]
    });
    fixture = TestBed.createComponent(ArticleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
