// Parent class for Movie
class Movie {
    constructor(title, director, year, genre) {
      this.title = title;
      this.director = director || "Unknown Director";
      this.year = year || "Unknown Year";
      this.genre = genre || "Unknown Genre";
    }
    // Display movie info in the corresponding HTML element
    displayInfo(elementId) {
      const movieDiv = document.getElementById(elementId);
      const movieInfo = document.createElement('p');
      movieInfo.textContent = `${this.title} is a ${this.genre} movie, directed by ${this.director}, released in ${this.year}.`;
      movieDiv.appendChild(movieInfo);
    }
  }
  // Subclass for Action movies
  class ActionMovie extends Movie {
    constructor(title, director, year) {
      super(title, director, year, "Action");
    }
  }
  // Subclass for Horror movies
  class HorrorMovie extends Movie {
    constructor(title, director, year) {
      super(title, director, year, "Horror");
    }
  }
  // Function to fetch movie data from TMDb API based on the search query
  async function fetchMovieData(query) {
    const apiKey = 'df5d5249f7bb070d5b49df49cd2c7c74';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    try {
      const response = await fetch(url);
      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Check if the 'results' array exists and has length
      if (data && data.results && data.results.length > 0) {
        return data.results;
      } else {
        console.log(`No results found for "${query}".`);
        return [];
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      return [];
    }
  }
  // Function to get credits (such as the director's name) for a specific movie
  async function getMovieDirector(movieId) {
    const apiKey = 'df5d5249f7bb070d5b49df49cd2c7c74'; // Replace with your actual TMDb API key
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
    try {
      const creditsResponse = await fetch(creditsUrl);
      const creditsData = await creditsResponse.json();
      const director = creditsData.crew.find(member => member.job === 'Director')?.name || "Unknown Director";
      return director;
    } catch (error) {
      console.error('Error fetching credits data:', error);
      return "Unknown Director";
    }
  }
  // Function to search movies and display results dynamically
  async function searchMovies() {
    const query = document.getElementById('movie-query').value;
    const resultsDiv = document.getElementById('movie-results');
    resultsDiv.innerHTML = '';  // Clear previous results
    // Fetch movies based on the search query
    const movies = await fetchMovieData(query);
    for (const movie of movies) {
      const title = movie.title;
      const year = new Date(movie.release_date).getFullYear();
      // Get the movie's director from credits API
      const director = await getMovieDirector(movie.id);
      // Instantiate either ActionMovie or HorrorMovie based on genre, or generic Movie if genre is unknown
      let movieInstance;
      const genre = movie.genre_ids.includes(28) ? "Action" : (movie.genre_ids.includes(27) ? "Horror" : "Other");
      if (genre === "Action") {
        movieInstance = new ActionMovie(title, director, year);
      } else if (genre === "Horror") {
        movieInstance = new HorrorMovie(title, director, year);
      } else {
        movieInstance = new Movie(title, director, year, genre);
      }
      // Display the movie information
      movieInstance.displayInfo('movie-results');
    }
  }