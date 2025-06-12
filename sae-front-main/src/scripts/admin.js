async function initAdmin() {
  const data = await getRessources();

  inputSalle(data);
  inputEnseignant(data);
  inputGroupes(data);

  const valeursInitiales = extractionValeursInitiales();

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    enregistrerFormulaire(e, data, valeursInitiales);
  });
}

function extractionValeursInitiales() {
  const valeursInitiales = {};
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    valeursInitiales[input.name] = input.value;
  });

  return valeursInitiales;
}

async function enregistrerFormulaire(e, data, valeursInitiales) {
  e.preventDefault();

  const inputs = document.querySelectorAll("input");
  const inputDate = document.querySelector("input[type='date']");
  let modifieRessource = false;
  let modifieDate = false;
  let erreur = false;

  const modifications = {};

  inputs.forEach((input) => {
    if (input.type !== "date" && input.value !== valeursInitiales[input.name]) {
      modifications[input.name] = input.value;
    }
  });

  for (const inputName in modifications) {
    if (modifications.hasOwnProperty(inputName)) {
      for (const d of data) {
        if (toUpperCase(d.nom_ressource) === inputName) {
          try {
            const res = await fetch(
              `http://localhost:3000/api/ressources/${d.id_ressource}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  code_ressource: modifications[inputName],
                  nom_ressource: d.nom_ressource,
                  type_ressource: d.type_ressource,
                  details_ressource: d.details_ressource,
                }),
              }
            );
            if (!res.ok) throw new Error("Erreur de mise à jour ressource.");
            modifieRessource = true;
          } catch (err) {
            console.error(err);
            erreur = true;
          }
        }
      }
    }
  }

  if (inputDate.value !== valeursInitiales[inputDate.name]) {
    try {
      const res = await fetch("http://localhost:3000/api/application", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ max_date: inputDate.value }),
      });

      if (!res.ok) throw new Error("Erreur de mise à jour de la date.");
      modifieDate = true;
    } catch (err) {
      console.error(err);
      erreur = true;
    }
  }

  if (modifieRessource || modifieDate) {
    if (!erreur) {
      alert("Mise à jour réussie !");
      window.location.href = "../pages/admin.html";
    } else {
      alert("Certaines modifications ont échoué.");
    }
  } else {
    alert("Merci de modifier au moins une ressource ou la date.");
  }
}

function inputSalle(data) {
  const salles = document.getElementById("salles");

  for (let i = 0; i < data.length; i++) {
    if (data[i].type_ressource === "salle") {
      const salle = data[i];
      const input = createInput(
        toUpperCase(salle.nom_ressource),
        salle.code_ressource
      );
      salles.appendChild(input);
    }
  }
}

function inputEnseignant(data) {
  const enseignants = document.getElementById("enseignants");

  for (let i = 0; i < data.length; i++) {
    if (data[i].type_ressource === "enseignant") {
      const enseignant = data[i];
      const input = createInput(
        toUpperCase(enseignant.nom_ressource),
        enseignant.code_ressource
      );
      enseignants.appendChild(input);
    }
  }
}

function inputGroupes(data) {
  const groupe1 = document.getElementById("premiereAnnee");
  const groupe2 = document.getElementById("deuxiemeAnnee");
  const groupeSpe = document.getElementById("anneeSpeciale");
  const groupe3 = document.getElementById("troisiemeAnnee");

  for (let i = 0; i < data.length; i++) {
    if (data[i].type_ressource === "groupe") {
      const groupe = data[i];
      const nom = groupe.nom_ressource;
      const input = createInput(toUpperCase(nom), groupe.code_ressource);

      if (nom.startsWith("ASPE")) {
        groupeSpe.appendChild(input);
      }

      if (nom.startsWith("BUT3")) {
        groupe3.appendChild(input);
      }

      const match = nom.match(/S(\d+)[A-Z]/);

      if (match) {
        const numeroAnnee = match[1];

        if (numeroAnnee === "1" || numeroAnnee === "2") {
          groupe1.appendChild(input);
        } else if (numeroAnnee === "3" || numeroAnnee === "4") {
          groupe2.appendChild(input);
        }
      }
    }
  }
}

function createInput(textContent, value) {
  const divCol = document.createElement("div");
  divCol.classList.add(
    "col",
    "d-flex",
    "align-items-center",
    "justify-content-between"
  );

  const label = document.createElement("label");
  label.classList.add("form-label", "d-flex", "align-items-center");
  label.textContent = `${textContent} =`;
  label.setAttribute("for", textContent);

  const input = document.createElement("input");
  input.classList.add("form-control");
  input.type = "text";
  input.name = textContent;
  input.id = textContent;
  input.value = value;

  divCol.appendChild(label);
  divCol.appendChild(input);

  return divCol;
}

function toUpperCase(ressource) {
  return ressource
    .split(".")
    .reverse()
    .map((word) => word.toUpperCase())
    .join(" ");
}

initAdmin();
