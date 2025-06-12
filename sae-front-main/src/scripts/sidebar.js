function initSidebar() {
  const data = JSON.parse(localStorage.getItem("data"));

  const preferences = document.querySelectorAll('[id^="preferences"]');
  const preferencesPanel = document.getElementById("panel-preferences");
  const closeBtn = document.getElementById("close-panel");

  optionEnseignant(data);
  optionGroupePreferences(data);
  optionSalle(data);
  definirMaxDateInput();

  const btnSalleInfo = document.querySelectorAll('input[id^="btn-salle-info"]');
  const btnSalleDS = document.querySelectorAll('input[id^="btn-salle-ds"]');
  const btnSalleTD = document.querySelectorAll('input[id^="btn-salle-td"]');

  btnSalleInfo.forEach((btn) => {
    btn.addEventListener("change", filtrerSalles);
  });

  btnSalleTD.forEach((btn) => {
    btn.addEventListener("change", filtrerSalles);
  });

  btnSalleDS.forEach((btn) => {
    btn.addEventListener("change", filtrerSalles);
  });

  preferences.forEach((preference) => {
    preference.addEventListener("click", () => {
      preferencesPanel.classList.add("open");
    });
  });

  closeBtn.addEventListener("click", () => {
    preferencesPanel.classList.remove("open");
  });
}

function filtrerSalles() {
  const salleSelects = document.querySelectorAll('[id^="salle"]');

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
    let optionSelectionneeEstVisible = false;
    const indexSelectionne = salleSelect.selectedIndex;

    for (let i = 1; i < salleSelect.options.length; i++) {
      const option = salleSelect.options[i];
      const type = option.dataset.roomType;

      if (filtresActifs.length === 0 || filtresActifs.includes(type)) {
        option.style.display = "";
        option.disabled = false;

        if (i === indexSelectionne) {
          optionSelectionneeEstVisible = true;
        }
      } else {
        option.style.display = "none";
        option.disabled = true;
      }
    }
  });
}

async function definirMaxDateInput() {
  try {
    const res = await fetch("http://localhost:3000/api/application", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération de la date.");
    }

    const data = await res.json();
    const maxDate = data.max_date;

    if (maxDate) {
      const inputDate = document.querySelector("input[type='date']");
      inputDate.max = maxDate;
    }
  } catch (err) {
    console.error("Erreur lors du chargement de la date :", err);
  }
}
