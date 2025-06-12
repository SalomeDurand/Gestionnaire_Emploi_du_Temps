// IIFE pour initialiser l'application
(function () {
  document.addEventListener("DOMContentLoaded", async function () {    
    const data = await getRessources();
    localStorage.setItem("data", JSON.stringify(data));
    checkAuth();
    await initSidebar();
    const calendarInstance = initCalendar();

    const form = document.querySelectorAll("form:not(#formPreferences)");
    form.forEach((f) => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        showLoader();

        enregistrerRecherche(e, data);
        recupEventsGoogle(e, calendarInstance);
        getCrenaux(e, calendarInstance);
      });
    });
  });
})();

let loaderTimeout;
const tempsChargement = 300; 

function showLoader(temps = tempsChargement) {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
  }
  
  loaderTimeout = setTimeout(() => {
    const loadingAnimation = document.getElementById("loading-animation");
    if (loadingAnimation) {
      loadingAnimation.classList.add("active");
    }
  }, temps);
}

function hideLoader() {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
    loaderTimeout = null;
  }
  
  const loadingAnimation = document.getElementById("loading-animation");
  if (loadingAnimation) {
    loadingAnimation.classList.remove("active");
  }
}

function recupEventsGoogle(e, calendarInstance) {
  const googleEvents = calendarInstance.getEvents().filter((event) => {
    return event.extendedProps && event.extendedProps.source === "google";
  });

  const formattedEvents = googleEvents.map((event) => ({
    start: event.start.toISOString(),
    end: event.end ? event.end.toISOString() : null,
  }));

  return formattedEvents;
}

function recuperationSallesSelectionnees() {
  // Salle seule sélectionnées.
  let sallesSelectionnees = [];
  const salleSelects = document.querySelectorAll('[id^="salle"]');
  for (let select of salleSelects) {
    sallesSelectionnees.push(select.value);
  }
  sallesSelectionnees = Array.from(
    new Set(sallesSelectionnees.filter((elt) => elt))
  );
  if (sallesSelectionnees.length === 1) {
    return sallesSelectionnees;
  }

  // Aucune préférence (plusieurs salles).
  const sallesDeLaListe = [];
  const typeInfo = Array.from(
    document.querySelectorAll('input[id^="btn-salle-info"]')
  ).some((el) => el.checked);
  const typeDs = Array.from(
    document.querySelectorAll('input[id^="btn-salle-ds"]')
  ).some((el) => el.checked);
  const typeTd = Array.from(
    document.querySelectorAll('input[id^="btn-salle-td"]')
  ).some((el) => el.checked);

  const filtresActifs = [];

  if (typeInfo) filtresActifs.push("info");
  if (typeDs) filtresActifs.push("ds");
  if (typeTd) filtresActifs.push("td");

  salleSelects.forEach((salleSelect) => {
    for (let i = 1; i < salleSelect.options.length; i++) {
      const option = salleSelect.options[i];
      const type = option.dataset.roomType;

      if (filtresActifs.length === 0 || filtresActifs.includes(type)) {
        sallesDeLaListe.push(option.value);
      }
    }
  });

  return Array.from(new Set(sallesDeLaListe));
}

//creation de params pour côte back
function getCrenaux(e, calendarInstance) {
  let minDate = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${new Date().getDate()}`;
  let maxDate = "2025-08-31";

  const dateInputsFrom = document.querySelectorAll(
    'input[id*="datepickerFrom"]'
  );
  const dateInputsTo = document.querySelectorAll('input[id*="datepickerTo"]');

  dateInputsFrom.forEach((input) => {
    if (input.value !== "") {
      if (new Date(input.value) > new Date(minDate)) {
        minDate = input.value;
      }
    }
  });

  dateInputsTo.forEach((input) => {
    if (input.value !== "") {
      if (new Date(input.value) > new Date(minDate)) {
        maxDate = input.value;
      }
    }
  });

  const allSalles = recuperationSallesSelectionnees();

  const resourcesRaw = [
    ...Array.from(document.querySelectorAll('select[id*="prof"]')).map(
      (elm) => elm.value
    ),
    ...Array.from(document.querySelectorAll('select[id*="groupe"]')).map(
      (elm) => elm.value
    ),
  ];

  const allParams = [];

  for (let salle of allSalles) {
    const ressources = [...resourcesRaw];
    ressources.push(salle);
    const filtered = Array.from(new Set(ressources.filter((elm) => elm)));

    const params = {
      resources: filtered.join(","),
      firstDate: minDate,
      lastDate: maxDate,
      importedEvents: recupEventsGoogle(e, calendarInstance),
    };

    allParams.push(params);
  }

  rechercherCreneau(allParams);
}

function formaterDateFr(dateString) {
  if (!dateString) return "non défini";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function enregistrerRecherche(e, data) {
  const formData = new FormData(e.target);

  const sallesIds = recuperationSallesSelectionnees();
  const sallesNoms = sallesIds
    .map((id) => getNomRessourceParId(data, id))
    .filter(Boolean); // filtre les null

  const recherche = {
    dateDebut: formaterDateFr(formData.get("dateDebut")),
    dateFin: formaterDateFr(formData.get("dateFin")),
    salle: sallesNoms.join(", ") || "non défini",
    salles: sallesNoms,
    enseignant:
      getNomRessourceParId(data, formData.get("prof")) || "non défini",
    groupe: getNomRessourceParId(data, formData.get("groupe")) || "non défini",
    periode: formData.get("periode") || "non défini",
    joursExclus: formData.getAll("jours").map(jour => parseInt(jour)),
  };

  localStorage.setItem("recherche", JSON.stringify(recherche));
}

function getNomRessourceParId(data, code) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].code_ressource === code) {
      return data[i] ? toUpperCase(data[i].nom_ressource) : "Non défini";
    }
  }
}
