import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVenteItemComponent } from './article-vente-item.component';

describe('ArticleVenteItemComponent', () => {
  let component: ArticleVenteItemComponent;
  let fixture: ComponentFixture<ArticleVenteItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleVenteItemComponent]
    });
    fixture = TestBed.createComponent(ArticleVenteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
