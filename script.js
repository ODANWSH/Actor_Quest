import { SECRET_API_KEY } from "./config.js"; // Import the API key from a separate config file for security

// Array to store actors whose primary department is "Acting"
let actorsInActing = [];

// Add event listener for the "Enter" key to trigger search when pressed in the input field
document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch(); // Call performSearch() when "Enter" is pressed
    }
  });

// Add event listener for the search button to allow clicking to trigger search
document
  .getElementById("search-button")
  .addEventListener("click", performSearch);

// Function to perform the search by calling the API and displaying results
function performSearch() {
  const query = document.getElementById("search-input").value; // Get the search query from input
  fetch(
    `https://api.themoviedb.org/3/search/person?api_key=${SECRET_API_KEY}&query=${query}`
  )
    .then((response) => {
      // Check if the network response was successful
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      const actorResultsDiv = document.getElementById("actor-results");
      actorResultsDiv.innerHTML = ""; // Clear previous search results

      // Filter results to only include actors with "Acting" as their main known department
      actorsInActing = json.results.filter(
        (actor) => actor.known_for_department === "Acting"
      );

      // Loop through filtered actors and create HTML elements for each
      actorsInActing.forEach((actor) => {
        const actorName = actor.name;
        const actorImage = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` // Display profile image if available
          : "IMG_6163.JPG"; // Default image if no profile image

        // Create a container div for each actor and set up a click event
        const actorDiv = document.createElement("div");
        actorDiv.className = "actor";
        actorDiv.addEventListener("click", () => {
          putResultInRightArea(actor); // Display actor details when clicked
          putListOfFilm(actor); // Display actor's filmography when clicked
        });

        // Create an img element for the actor's image
        const img = document.createElement("img");
        img.src = actorImage;
        img.alt = actorName;
        img.style.width = "100px";
        img.style.height = "auto";

        // Create a paragraph element for the actor's name
        const nameElement = document.createElement("p");
        nameElement.textContent = actorName;

        // Append image and name to the actor's container div
        actorDiv.appendChild(img);
        actorDiv.appendChild(nameElement);
        actorResultsDiv.appendChild(actorDiv); // Add the actor div to the results container
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error); // Log errors to console
    });
}

// Function to display detailed information about the selected actor
function putResultInRightArea(actor) {
  const aboutActorDiv = document.getElementById("about-actor");
  aboutActorDiv.innerHTML = ""; // Clear previous details

  const actorName = actor.name;
  const actorImage = actor.profile_path
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` // Use profile path if available
    : "IMG_6163.JPG"; // Default image

  // Fetch more detailed actor data from API
  fetch(
    `https://api.themoviedb.org/3/person/${actor.id}?api_key=${SECRET_API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((detailedActor) => {
      let actorBiography =
        detailedActor.biography || "This actor does not have a biography."; // Use biography or default text
      let age = getAge(detailedActor.birthday, detailedActor.deathday); // Calculate age
      let dateOfDeath = detailedActor.deathday || "This actor is not dead."; // Display death date or default text

      // Create HTML elements for actor details
      const actorDiv = document.createElement("div");
      actorDiv.className = "actor-detail";

      const img = document.createElement("img");
      img.src = actorImage;
      img.alt = actorName;
      img.style.width = "100px";
      img.style.height = "auto";

      const nameElement = document.createElement("h2");
      nameElement.textContent = actorName;

      const ageElement = document.createElement("p");
      ageElement.textContent = `Age: ${age}`;

      const deathDay = document.createElement("p");
      deathDay.textContent = `Date of death: ${dateOfDeath}`;

      // Alternative names
      const alternativeNamesTitle = document.createElement("h3");
      alternativeNamesTitle.textContent = "Also known as:";
      const alternativeNamesList = document.createElement("ul");

      // List alternative names or show a default message
      if (
        detailedActor.also_known_as &&
        detailedActor.also_known_as.length > 0
      ) {
        detailedActor.also_known_as.forEach((name) => {
          const nameItem = document.createElement("li");
          nameItem.textContent = name;
          alternativeNamesList.appendChild(nameItem);
        });
      } else {
        const noNames = document.createElement("p");
        noNames.textContent = "No alternative names available.";
        alternativeNamesList.appendChild(noNames);
      }

      // Add biography title and content
      const biographyTitle = document.createElement("h3");
      biographyTitle.textContent = "Biography:";
      const biographyElement = document.createElement("p");
      biographyElement.textContent = actorBiography;

      // Append all details to the main div
      actorDiv.appendChild(img);
      actorDiv.appendChild(nameElement);
      actorDiv.appendChild(ageElement);
      actorDiv.appendChild(deathDay);
      actorDiv.appendChild(alternativeNamesTitle);
      actorDiv.appendChild(alternativeNamesList);
      actorDiv.appendChild(biographyTitle);
      actorDiv.appendChild(biographyElement);

      aboutActorDiv.appendChild(actorDiv); // Add actor details to the main container
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error); // Log errors
    });
}

// Function to display the list of movies the actor appeared in
function putListOfFilm(actor) {
  const listOfFilm = document.getElementById("about-actor-film");
  listOfFilm.innerHTML = ""; // Clear previous film list

  // Fetch actor's movie credits from API
  fetch(
    `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${SECRET_API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((listMovie) => {
      const movieDiv = document.createElement("div");
      movieDiv.className = "movie-list";

      // Title for the movie list
      const movieTitle = document.createElement("h3");
      movieTitle.textContent = "Movies:";
      movieDiv.appendChild(movieTitle);

      const movieList = document.createElement("ul");

      // Add each movie to the list or display a default message if none found
      if (listMovie.cast && listMovie.cast.length > 0) {
        listMovie.cast.forEach((movie) => {
          const filmItem = document.createElement("li");
          filmItem.textContent = `${movie.title} (${
            movie.release_date?.split("-")[0] || "N/A"
          })`;
          movieList.appendChild(filmItem);
        });
      } else {
        const noMovie = document.createElement("p");
        noMovie.textContent = "No movies available.";
        movieDiv.appendChild(noMovie);
      }

      movieDiv.appendChild(movieList);
      listOfFilm.appendChild(movieDiv);
    });
}

// Function to calculate the age of the actor from birthdate and death date (if applicable)
function getAge(birthday, deathDate = null) {
  if (!birthday) return "Age not available";
  const birthDate = new Date(birthday);
  const endDate = deathDate ? new Date(deathDate) : new Date();

  // Calculate age by subtracting years and adjusting for months/days
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = endDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} years old`; // Return age as a formatted string
}
