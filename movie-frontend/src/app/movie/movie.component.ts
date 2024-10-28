import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies: Movie[] = [];
  editingMovieId: number | null = null;
  newMovie: Movie = { title: '', description: '', releaseDate: '', genre: '' };

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => this.movies = movies);
  }

  addMovie(): void {
    this.newMovie.releaseDate = this.getCurrentDateTime(); // Set the release date
    this.movieService.createMovie(this.newMovie).subscribe(() => {
      this.loadMovies();
      this.newMovie = { title: '', description: '', releaseDate: '', genre: '' };
    });
  }
  saveMovie(): void {
    if (this.editingMovieId) {
      this.newMovie.releaseDate = this.formatDateForBackend(this.newMovie.releaseDate);
      // Update existing movie
      this.movieService.updateMovie(this.editingMovieId, this.newMovie).subscribe(() => {
        this.loadMovies(); // Refresh the movie list
        this.resetForm();
      });
    }
  }
  editMovie(movie: any) {
    this.newMovie = { ...movie }; // Populate the form with selected movie data
    this.editingMovieId = movie.id; // Store the ID of the movie being edited
  
    // Ensure releaseDate is formatted correctly for the datetime-local input
    this.newMovie.releaseDate = this.formatDateForInput(movie.releaseDate);
  }
  
  // Helper function to format the date
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Formats to 'YYYY-MM-DDTHH:MM'
  }
  formatDateForBackend(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString(); // Full ISO string for backend: 'YYYY-MM-DDTHH:MM:SSZ'
  }
  

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(() => {
      this.loadMovies(); // Refresh the movie list after deletion
    });
  }

  resetForm() {
    this.newMovie = { id: null, title: '', description: '', releaseDate: '', genre: '' }; // Reset the form
    this.editingMovieId = null; // Clear editing ID
  }

  getCurrentDateTime(): string {
    return new Date().toISOString(); // Generate current date-time in ISO format
  }
}
