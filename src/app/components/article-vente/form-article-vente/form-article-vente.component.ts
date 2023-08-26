import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-article-vente',
  templateUrl: './form-article-vente.component.html',
  styleUrls: ['./form-article-vente.component.css']
})
export class FormArticleVenteComponent {
  articleVenteForm: FormGroup = <FormGroup>{};
}
