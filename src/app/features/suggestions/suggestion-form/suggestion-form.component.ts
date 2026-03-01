import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrl: './suggestion-form.component.css'
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  id: number = 0; // 0 = mode ajout

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actR: ActivatedRoute,
    private service: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', [Validators.required]],
      date: [{value: '', disabled: true}],
      status: [{value: 'en attente', disabled: true}]
    });

    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
      // mode modification : on charge les donnees existantes
      this.service.getSuggestionById(this.id).subscribe(data => {
        this.suggestionForm.patchValue(data);
      });
    } else {
      // mode ajout : on met la date du jour
      let today = new Date();
      let jour = String(today.getDate()).padStart(2, '0');
      let mois = String(today.getMonth() + 1).padStart(2, '0');
      let annee = today.getFullYear();
      this.suggestionForm.get('date')?.setValue(jour + '/' + mois + '/' + annee);
    }
  }

  onSubmit() {
    if (this.suggestionForm.valid) {
      if (this.id) {
        // mode modification
        this.service.updateSuggestion(this.id, this.suggestionForm.value).subscribe(() => {
          this.router.navigate(['/suggestions']);
        });
      } else {
        // mode ajout
        this.service.addSuggestion(this.suggestionForm.value).subscribe(() => {
          this.router.navigate(['/suggestions']);
        });
      }
    }
  }

}
