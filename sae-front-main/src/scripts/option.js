function optionSalle(data) {
  const salles = document.querySelectorAll('select[id^="salle"]');
  salles.forEach((selectSalle) => {
    selectSalle.appendChild(createDefaultOption());

    for (let i = 0; i < data.length; i++) {
      if (data[i].type_ressource === "salle") {
        const salle = data[i];
        const option = createOption(
          toUpperCase(salle.nom_ressource),
          salle.code_ressource
        );
        option.dataset.roomType = salle.details_ressource;
        selectSalle.appendChild(option);
      }
    }
  });
}

function optionEnseignant(data) {
  const enseignants = document.querySelectorAll('select[id^="prof"]');
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.code_ressource : "";

  enseignants.forEach((selectEnseignant) => {
    selectEnseignant.appendChild(createDefaultOption());

    for (let i = 0; i < data.length; i++) {
      if (data[i].type_ressource === "enseignant") {
        const enseignant = data[i];
        const option = createOption(
          toUpperCase(enseignant.nom_ressource),
          enseignant.code_ressource
        );
        selectEnseignant.appendChild(option);

        if (enseignant.code_ressource === username) {
          option.selected = true; 
        }
      }
    }
  });

  console.log("Utilisateur code_ressource:", username);  // Afficher le code_ressource de l'utilisateur
}

function optionGroupePreferences(data) {
  const containerCheckbox = document.getElementById("containerCheckbox");
  const formPreferences = document.getElementById("formPreferences");

  getUserPreferences().then((preferences) => {
  const hasNoPreferences = !preferences || preferences.length === 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].type_ressource === "groupe") {
        const groupe = data[i];
        containerCheckbox.appendChild(
          createPreference(
            toUpperCase(groupe.nom_ressource),
            groupe.code_ressource,
            preferences, hasNoPreferences
          )
        );
      }
    }

    updateSelectOptions(false);

    formPreferences.addEventListener("submit", async (e) => {
      e.preventDefault();
      updateSelectOptions();

      const preferences = getPreferences();
      await deleteUserPreferences();
      await createUserPreferences(preferences);
    });
  });
}

function getPreferences() {
  const groupes = document.querySelectorAll('select[id^="groupe"]');
  const preferences = new Set(); //pour éviter doublons

  groupes.forEach((selectGroupe) => {
    const options = selectGroupe.querySelectorAll("option");

    options.forEach((option) => {
      if (option.value && option.value.trim() !== "") {
        preferences.add(option.value);
      }
    });
  });

  return Array.from(preferences);
}

function createDefaultOption() {
  return createOption("aucune préférence", "");
}

function createOption(textContent, value) {
  const option = document.createElement("option");
  option.textContent = textContent;
  option.value = value;
  return option;
}

let checkboxCounter = 0;

function createPreference(textContent, value, preferences, checkAllByDefault) {
  const uniqueId = "checkbox-" + checkboxCounter++;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.role = "switch";
  checkbox.classList.add("form-check-input");
  checkbox.id = uniqueId;
  checkbox.value = value;

  if (checkAllByDefault) {
    checkbox.checked = true;
  } else {
    const isChecked = preferences.some((pref) => pref.code_ressource === value);
    checkbox.checked = isChecked;
  }

  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.textContent = textContent;
  label.setAttribute("for", uniqueId);

  const container = document.createElement("div");
  container.classList.add("col-12", "col-sm-6", "col-md-4");
  container.appendChild(checkbox);
  container.appendChild(label);

  return container;
}

function toUpperCase(ressource) {
  return ressource
    .split(".")
    .reverse()
    .map((word) => word.toUpperCase())
    .join(" ");
}

function updateSelectOptions(showMessage = true) {
  const groupes = document.querySelectorAll('select[id^="groupe"]');
  const containerCheckbox = document.getElementById("containerCheckbox");

  groupes.forEach((selectGroupe) => {
    selectGroupe.innerHTML = "";
    selectGroupe.appendChild(createDefaultOption());

    Array.from(containerCheckbox.children).forEach((elem) => {
      const label = elem.querySelector("label");
      const input = elem.querySelector("input");

      if (input.checked) {
        selectGroupe.appendChild(createOption(label.textContent, input.value));
      }
    });
  });

  if (showMessage) {
    const confirmationMessage = document.getElementById("confirmationMessage");
    confirmationMessage.classList.remove("d-none");

    setTimeout(() => {
      confirmationMessage.classList.add("d-none");
    }, 5000);
  }
}
