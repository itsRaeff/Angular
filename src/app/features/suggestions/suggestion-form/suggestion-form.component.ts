import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrl: './suggestion-form.component.css'
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // je recupere la date du jour
    let today = new Date();
    let jour = String(today.getDate()).padStart(2, '0');
    let mois = String(today.getMonth() + 1).padStart(2, '0');
    let annee = today.getFullYear();
    let dateAujourdhui = jour + '/' + mois + '/' + annee;

    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', [Validators.required]],
      date: [{value: dateAujourdhui, disabled: true}],
      status: [{value: 'en attente', disabled: true}]
    });
  }

  onSubmit() {
    if (this.suggestionForm.valid) {
      console.log(this.suggestionForm.value);
      // redirection vers la liste
      this.router.navigate(['/suggestions']);
    }
  }

}
