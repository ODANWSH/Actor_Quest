import { SECRET_API_KEY } from "./config.js";

let actorsInActing = [];

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

      actorsInActing = json.results.filter(
        (actor) => actor.known_for_department === "Acting"
      );

      actorsInActing.forEach((actor) => {
        const actorName = actor.name;
        const actorImage = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : "IMG_6163.JPG";

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

function putResultInRightArea(actor) {
  const aboutActorDiv = document.getElementById("about-actor");
  aboutActorDiv.innerHTML = ""; // Effacer les résultats précédents

  const actorName = actor.name;
  const actorImage = actor.profile_path
    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
    : "IMG_6163.JPG";

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
        detailedActor.biography || "This actor does not have a biography.";
      let age = getAge(detailedActor.birthday, detailedActor.deathday);
      let dateOfDeath = detailedActor.deathday || "This actor is not dead.";

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

      const alternativeNamesTitle = document.createElement("h3");
      alternativeNamesTitle.textContent = "Also known as:";

      const alternativeNamesList = document.createElement("ul");
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

      // Titre pour la biographie
      const biographyTitle = document.createElement("h3");
      biographyTitle.textContent = "Biography:";

      // Biographie de l'acteur
      const biographyElement = document.createElement("p");
      biographyElement.textContent = actorBiography;

      // Ajout des éléments au-dessus de la biographie
      actorDiv.appendChild(img);
      actorDiv.appendChild(nameElement);
      actorDiv.appendChild(ageElement);
      actorDiv.appendChild(deathDay);
      actorDiv.appendChild(alternativeNamesTitle);
      actorDiv.appendChild(alternativeNamesList);
      actorDiv.appendChild(biographyTitle);
      actorDiv.appendChild(biographyElement);

      aboutActorDiv.appendChild(actorDiv); // Affichage du résultat sélectionné
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function getAge(birthday, deathDate = null) {
  if (!birthday) return "Age not available";
  const birthDate = new Date(birthday);
  const endDate = deathDate ? new Date(deathDate) : new Date();

  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = endDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && endDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} years old`;
}
