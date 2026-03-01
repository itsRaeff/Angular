import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestions-list',
  templateUrl: './suggestions-list.component.html',
  styleUrls: ['./suggestions-list.component.css']
})
export class SuggestionsListComponent implements OnInit {
  suggestions: Suggestion[] = [];
  searchTerm: string = '';
  favorites: Suggestion[] = [];

  constructor(private router: Router, private suggestionService: SuggestionService) {}

  ngOnInit() {
    this.chargerSuggestions();
  }

  chargerSuggestions() {
    this.suggestionService.getSuggestions().subscribe(data => {
      this.suggestions = data;
    });
  }

  ajouterSuggestion() {
    this.router.navigate(['/suggestions/add']);
  }

  onLike(suggestion: Suggestion) {
    let nouveauLike = suggestion.nbLikes + 1;
    this.suggestionService.updateLikes(suggestion.id, nouveauLike).subscribe(() => {
      suggestion.nbLikes = nouveauLike;
    });
  }

  onAddToFavorites(suggestion: Suggestion) {
    this.favorites.push(suggestion);
  }

  onDetails(id: number) {
    this.router.navigate(['/suggestions', id]);
  }

  supprimerSuggestion(id: number) {
    this.suggestionService.deleteSuggestion(id).subscribe(() => {
      this.chargerSuggestions();
    });
  }

  getFilteredSuggestions(): Suggestion[] {
    return this.suggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      suggestion.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
