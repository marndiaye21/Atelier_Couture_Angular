import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArticleComponent } from './form-article.component';

describe('FormArticleComponent', () => {
  let component: FormArticleComponent;
  let fixture: ComponentFixture<FormArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormArticleComponent]
    });
    fixture = TestBed.createComponent(FormArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
