function main() {
  function gardeSiBonJourDeLaSemaine(event, joursExclus) {
    const start = new Date(event.start);
    let end = new Date(event.end);

    if (!event.end || isNaN(end) || end < start) {
      end = new Date(start);
    }

    // heures à 00:00 pour comparer les jours uniquement
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const fin = new Date(end);
    fin.setHours(0, 0, 0, 0);

    // On regarde tous les jours de la période.
    // Si au moins un est interdit, on refuse l'event.
    while (current <= fin) {
      // 0 = dimanche, ..., 6 = samedi
      const jour = current.getDay();
      if (joursExclus.includes(jour)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  }

  const jours = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  function trouveJour(jour) {
    return jours[jour];
  }

  function filterPeriode(event, periode) {
    const start = new Date(event.start);
    const eventHour = start.getHours() - 2;

    if (periode === "matin" && eventHour >= 13) {
      return false;
    }
    if (periode === "après-midi" && eventHour < 13) {
      return false;
    }
    return true;
  }

  function renderCalendarWithLocalEvents(resultats) {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "fr",
      themeSystem: "bootstrap5",
      initialView: "listYear",
      headerToolbar: {
        left: "",
        right: "",
      },
      noEventsContent: "Aucun créneau disponible",

      eventSources: [
        {
          events: async function (fetchInfo, successCallback, failureCallback) {
            try {
              const data = await getRessources();
              const resultats = JSON.parse(
                localStorage.getItem("resultats") || "[]"
              );
              const recherche = JSON.parse(localStorage.getItem("recherche"));

              const events = [];
              for (const event of resultats) {
                if (
                  !gardeSiBonJourDeLaSemaine(event, recherche.joursExclus || [])
                ) {
                  continue;
                }

                if (!filterPeriode(event, recherche.periode || "")) {
                  continue;
                }

                const ressources = Array.isArray(event.resources)
                  ? event.resources
                  : String(event.resources)
                      .split(",")
                      .map((r) => r.trim());

                const salleCode = ressources.find((code) => {
                  const el = data.find(
                    (d) => String(d.code_ressource).trim() === code
                  );
                  return el && el.type_ressource === "salle";
                });

                const salle = data.find(
                  (el) => String(el.code_ressource).trim() === salleCode
                );

                events.push({
                  start: event.start,
                  end: event.end,
                  title: salle.nom_ressource || "Non défini",
                  allDay: false,
                });
              }
              successCallback(events);
            } catch (error) {
              console.error(
                "Erreur lors du chargement des événements :",
                error
              );
              failureCallback(error);
            }
          },
        },
      ],

      eventClick: function (info) {
        // Titre de la modale
        const modalTitle = document.getElementById("modalTitle");
        modalTitle.textContent = "Créneau disponible";

        // Contenu de la modale
        const modalBody = document.getElementById("modalBody");

        const startDate = info.event.start
          ? info.event.start.toLocaleDateString()
          : "Non spécifié";
        const startTime = info.event.start
          ? info.event.start.toLocaleTimeString().split(":", 2).join(":")
          : "";
        const endDate = info.event.end
          ? info.event.end.toLocaleDateString()
          : "Non spécifié";
        const endTime = info.event.end
          ? info.event.end.toLocaleTimeString().split(":", 2).join(":")
          : "";
        const salle = info.event.title || "Non spécifiée";

        modalBody.innerHTML = `
                    <strong>Début :</strong> ${startDate} à ${startTime} <br>
                    <strong>Fin :</strong> ${endDate} à ${endTime} <br>
                    <div class="d-flex justify-content-between align-items-center">
                    <span><strong>Lieu :</strong> ${salle}</span>
                    <button id="choix" class="btn btn-primary">Choisir ce créneau</button>
                    </div>`;

        const button = document.getElementById("choix");
        button.addEventListener("click", function () {
          envoyerMail(info.event);
        });

        const modal = document.getElementById("calendarModal");
        modal.style.display = "block";
      },
    });

    return calendar;
  }

  let calendarInstance;

  document.addEventListener("DOMContentLoaded", function () {
    calendarInstance = renderCalendarWithLocalEvents();
    calendarInstance.render();

    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        const modal = document.getElementById("calendarModal");
        modal.style.display = "none";
      });
    }

    window.addEventListener("click", function (event) {
      const modal = document.getElementById("calendarModal");
      if (modal && event.target === modal) {
        modal.style.display = "none";
      }
    });

    const btnRecherche = document.getElementById("btnRecherche");
    btnRecherche.addEventListener("click", function () {
      window.location.href = "../../index.html";
    });

    const recherche = JSON.parse(localStorage.getItem("recherche"));

    if (recherche) {
      const affichageRecherche = document.getElementById("criteresRecherche");
      affichageRecherche.innerHTML = `Créneaux disponibles pour la recherche :<br>
        <div id="recherche">
        Du ${recherche.dateDebut} au ${recherche.dateFin},<br>
        Salle : ${recherche.salle},<br>
        Enseignant : ${recherche.enseignant},<br>
        Groupe : ${recherche.groupe},<br>
        Période de la journée : ${recherche.periode},<br>
        Jours à exclure : ${
          recherche.joursExclus.length > 0
            ? recherche.joursExclus
                .map((jourExclu) => trouveJour(jourExclu))
                .join(", ")
            : "non défini"
        }
        </div>
        `;
    }
  });
}

function envoyerMail(event) {
  const email = "admin@admin.com";
  const subject = encodeURIComponent("Demande de déplacement de créneau");

  const startDate = event.start
    ? event.start.toLocaleDateString()
    : "Non spécifié";
  const startTime = event.start
    ? event.start.toLocaleTimeString().split(":", 2).join(":")
    : "";
  const endDate = event.end ? event.end.toLocaleDateString() : "Non spécifié";
  const endTime = event.end
    ? event.end.toLocaleTimeString().split(":", 2).join(":")
    : "";
  const salle = event.title || "Non spécifié";

  const user = JSON.parse(localStorage.getItem("user"));
  const nomUtilisateur = user.nom_utilisateur.replace(/\./g, " ").toUpperCase();

  const body =
    encodeURIComponent(`Bonjour,\n\nJ'aimerais déplacer le créneau suivant : [à compléter manuellement], vers ce créneau : ${startDate} à ${startTime}
Fin : ${endDate} à ${endTime}
Lieu : ${salle}.\n\nCordialement,\n\n${nomUtilisateur}`);

  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
}

main();
