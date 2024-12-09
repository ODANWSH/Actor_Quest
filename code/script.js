import { SECRET_API_KEY } from "./config.js";

// Array to store actors who are in acting
let actorsInActing = [];
// Retrieve search history from localStorage, or initialize an empty array
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Add event listener for "Enter" key press to trigger search
document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch(); // Call performSearch function when "Enter" key is pressed
    }
  });

// Add event listener for the search button to trigger search
document
  .getElementById("search-button")
  .addEventListener("click", performSearch); // Perform search when button is clicked

// Perform the actor search using the TMDB API
function performSearch() {
  const query = document.getElementById("search-input").value; // Get the search query
  if (!query) return; // Prevent search if input is empty

  // Save the search query to history and update the UI
  saveToHistory(query);

  // Fetch results from the TMDB API for actor search
  fetch(
    `https://api.themoviedb.org/3/search/person?api_key=${SECRET_API_KEY}&query=${query}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText); // Error handling for network response
      }
      return response.json(); // Parse the response as JSON
    })
    .then((json) => {
      const actorResultsDiv = document.getElementById("actor-results");
      actorResultsDiv.innerHTML = ""; // Clear any previous results

      // Filter actors that are specifically in acting
      actorsInActing = json.results.filter(
        (actor) => actor.known_for_department === "Acting"
      );

      // Loop through each actor and display their information
      actorsInActing.forEach((actor) => {
        const actorName = actor.name; // Actor's name
        const actorImage = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` // Image URL if available
          : "/assets/IMG_6163.JPG"; // Default image if no profile path

        const actorDiv = document.createElement("div");
        actorDiv.className = "actor"; // Add class for styling
        actorDiv.addEventListener("click", () => {
          // Remove the 'selected' class from all actor divs
          document
            .querySelectorAll(".actor")
            .forEach((div) => div.classList.remove("selected"));

          // Add 'selected' class to the clicked actor
          actorDiv.classList.add("selected");

          // Display detailed information for the selected actor and their films
          putResultInRightArea(actor);
          putListOfFilm(actor);
        });

        const img = document.createElement("img");
        img.src = actorImage; // Set the image source
        img.alt = actorName; // Set the alt text as actor name
        img.style.width = "100px"; // Set image width

        const nameElement = document.createElement("p");
        nameElement.textContent = actorName; // Display actor's name

        // Append image and name to the actor div
        actorDiv.appendChild(img);
        actorDiv.appendChild(nameElement);
        actorResultsDiv.appendChild(actorDiv); // Append actor div to the results section
      });
    })
    .catch((error) => {
      console.error("Fetch operation failed:", error); // Log any fetch errors
    });
}

// Display detailed information about the selected actor
function putResultInRightArea(actor) {
  const aboutActorDiv = document.getElementById("about-actor");
  aboutActorDiv.innerHTML = ""; // Clear previous details

  const actorImage = actor.profile_path
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` // Actor's profile image
    : "/assets/IMG_6163.JPG"; // Default image if no profile path

  // Fetch detailed actor information from the TMDB API
  fetch(
    `https://api.themoviedb.org/3/person/${actor.id}?api_key=${SECRET_API_KEY}`
  )
    .then((response) => response.json()) // Parse the response as JSON
    .then((detailedActor) => {
      const actorDiv = document.createElement("div");
      actorDiv.className = "actor-detail"; // Add class for styling

      const img = document.createElement("img");
      img.src = actorImage; // Actor's image
      img.alt = actor.name; // Actor's name as alt text
      img.style.width = "150px"; // Set image width

      const nameElement = document.createElement("h2");
      nameElement.textContent = actor.name; // Display actor's name

      const bioElement = document.createElement("p");
      bioElement.textContent =
        detailedActor.biography || "Biography not available."; // Display biography or default message

      const birthdayElement = document.createElement("p");
      birthdayElement.textContent = `Born: ${detailedActor.birthday || "N/A"}`; // Display birthday

      const placeOfBirthElement = document.createElement("p");
      placeOfBirthElement.textContent = `Place of Birth: ${
        detailedActor.place_of_birth || "N/A"
      }`; // Display place of birth

      // Append actor details to the actor div
      actorDiv.appendChild(img);
      actorDiv.appendChild(nameElement);
      actorDiv.appendChild(bioElement);
      actorDiv.appendChild(birthdayElement);
      actorDiv.appendChild(placeOfBirthElement);

      aboutActorDiv.appendChild(actorDiv); // Append actor details to the right section
    })
    .catch((error) => {
      console.error("Failed to fetch actor details:", error); // Log any errors
    });
}

// Display the list of movies the actor has appeared in
function putListOfFilm(actor) {
  const listOfFilm = document.getElementById("about-actor-film");
  listOfFilm.innerHTML = ""; // Clear previous films

  // Fetch movie credits for the actor
  fetch(
    `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${SECRET_API_KEY}`
  )
    .then((response) => response.json()) // Parse the response as JSON
    .then((listMovie) => {
      const movieDiv = document.createElement("div");
      movieDiv.className = "movie-list"; // Add class for styling

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = "Movies:"; // Title for movie list
      movieDiv.appendChild(movieTitle);

      const movieList = document.createElement("ul"); // Create a list for movies
      listMovie.cast.forEach((movie) => {
        const filmItem = document.createElement("li");
        // Display movie title and release year (if available)
        filmItem.textContent = `${movie.title} (${
          movie.release_date?.split("-")[0] || "N/A"
        })`;
        movieList.appendChild(filmItem); // Add each movie to the list
      });

      movieDiv.appendChild(movieList); // Append the movie list to the div
      listOfFilm.appendChild(movieDiv); // Append movie div to the right section
    })
    .catch((error) => {
      console.error("Failed to fetch movie credits:", error); // Log any errors
    });
}

// Save the search query to localStorage and update the search history UI
function saveToHistory(query) {
  // Remove the query if it already exists in history
  searchHistory = searchHistory.filter((item) => item !== query);

  // Add the new query to the beginning of the history
  searchHistory.unshift(query);

  // Save the updated history to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  updateHistoryUI(); // Update the UI with the new history
}

function updateHistoryUI() {
  const historyDiv = document.querySelector(".user-history");
  historyDiv.innerHTML = ""; // Clear current history display

  const historyTitle = document.createElement("h3");
  historyTitle.textContent = "Search History:"; // Add a title for the history section
  historyDiv.appendChild(historyTitle); // Append the title to the history section

  const historyList = document.createElement("ul"); // Create an unordered list for the history items
  searchHistory.forEach((query) => {
    const historyItem = document.createElement("li"); // Create a list item for each search query
    historyItem.textContent = query; // Set the text content to the search query
    historyList.appendChild(historyItem); // Add the item to the list
  });

  historyDiv.appendChild(historyList); // Append the list to the history section
}
// Initialize history on page load by calling the update function
updateHistoryUI();
