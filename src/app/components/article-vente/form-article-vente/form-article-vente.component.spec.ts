import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArticleVenteComponent } from './form-article-vente.component';

describe('FormArticleVenteComponent', () => {
  let component: FormArticleVenteComponent;
  let fixture: ComponentFixture<FormArticleVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormArticleVenteComponent]
    });
    fixture = TestBed.createComponent(FormArticleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
