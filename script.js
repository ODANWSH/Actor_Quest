import { SECRET_API_KEY } from "./config.js";

let actorsInActing = [];

document
  .getElementById("search-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

function putResultInRightArea(actor) {
  const aboutActorDiv = document.getElementById("about-actor");
  aboutActorDiv.innerHTML = ""; // Effacer les résultats précédents

  const actorId = actor.id;
  const actorName = actor.name;
  const actorImage = actor.profile_path
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
    : "IMG_6163.JPG"; // Image de remplacement si manquante

  fetch(
    `https://api.themoviedb.org/3/person/${actor.id}?api_key=${SECRET_API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {});

  // Création de la div pour l'acteur sélectionné
  const actorDiv = document.createElement("div");
  actorDiv.className = "actor-detail"; // Ajouter une classe pour le style

  // Image de l'acteur
  const img = document.createElement("img");
  img.src = actorImage;
  img.alt = actorName;
  img.style.width = "100px";
  img.style.height = "auto";

  const nameElement = document.createElement("h2");
  nameElement.textContent = actorName;

  const putTitleBiography = document.createElement("h3");
  putTitleBiography.textContent = "Biography :";

  const biographyElement = document.createElement("p");
  biographyElement.textContent = actorBiography;

  actorDiv.appendChild(img);
  actorDiv.appendChild(nameElement);
  actorDiv.appendChild(biographyElement);
  actorDiv.appendChild(putTitleBiography);

  aboutActorDiv.appendChild(actorDiv); // Affichage du résultat sélectionné
}

function performSearch() {
  const query = document.getElementById("search-input").value;
  fetch(
    `https://api.themoviedb.org/3/search/person?api_key=${SECRET_API_KEY}&query=${query}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((json) => {
      const actorResultsDiv = document.getElementById("actor-results");
      actorResultsDiv.innerHTML = ""; // Effacer les résultats précédents

      // Filtrer les acteurs dans le domaine du cinéma
      actorsInActing = json.results.filter(
        (actor) => actor.known_for_department === "Acting"
      );

      actorsInActing.forEach((actor) => {
        const actorName = actor.name;
        const actorImage = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : "IMG_6163.JPG";

        // Créer la div pour chaque acteur
        const actorDiv = document.createElement("div");
        actorDiv.className = "actor";
        actorDiv.addEventListener("click", () => putResultInRightArea(actor));

        const img = document.createElement("img");
        img.src = actorImage;
        img.alt = actorName;
        img.style.width = "100px";
        img.style.height = "auto";

        const nameElement = document.createElement("p");
        nameElement.textContent = actorName;

        actorDiv.appendChild(img);
        actorDiv.appendChild(nameElement);
        actorResultsDiv.appendChild(actorDiv);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
