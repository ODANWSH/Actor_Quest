var key = config.SECRET_API_KEY;
console.log(key);
document.getElementById("search-button").addEventListener("click", function () {
  performSearch();
});

document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

function performSearch() {
  const query = document.getElementById("search-input").value;
  fetch(
    `https://api.themoviedb.org/3/search/person?api_key=${key}f&query=${query}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      // Clear previous results
      const actorResultsDiv = document.getElementById("actor-results");
      actorResultsDiv.innerHTML = ""; // Clear previous actor results

      // Filter to get only actors with "known_for_department" as "Acting"
      const actorsInActing = json.results.filter(
        (actor) => actor.known_for_department === "Acting"
      );

      // Process and display each filtered actor
      actorsInActing.forEach((actor) => {
        const actorName = actor.name;
        const actorImage = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : "IMG_6163.JPG"; // Placeholder image

        // Create a new div for each actor
        const actorDiv = document.createElement("div");
        actorDiv.className = "actor"; // Add a class for styling

        // Create an image element
        const img = document.createElement("img");
        img.src = actorImage;
        img.alt = actorName;
        img.style.width = "100px"; // Set image width
        img.style.height = "auto"; // Maintain aspect ratio

        // Add name and image to the actor div
        actorDiv.appendChild(img);
        const nameElement = document.createElement("p");
        nameElement.textContent = actorName; // Set the actor's name
        actorDiv.appendChild(nameElement); // Add the name to the actor div
        actorResultsDiv.appendChild(actorDiv); // Append to the results div
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
