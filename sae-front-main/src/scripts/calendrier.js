function initCalendar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const code_ressource = user.code_ressource;
  function renderCalendarWithLocalEvents() {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
      height: "100%",
      locale: "fr",
      allDayText: "Jour entier",
      themeSystem: "bootstrap5",
      headerToolbar: {
        left: "title",
        center: "dayGridMonth,timeGridWeek,timeGridDay",
        right: "prev,next today addCalendarButton deconnexion",
      },

      nowIndicator: true,

      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: "08:00",
        endTime: "20:00",
      },

      dayMaxEvents: true,

      buttonText: {
        today: "Aujourd'hui",
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        prev: "❮",
        next: "❯",
      },

      customButtons: {
        addCalendarButton: {
          text: "Importer Google Calendar",
          click: function () {
            if (gapi.client.getToken()) {
              signoutClick();
            } else {
              authClick();
            }
          },
        },
        deconnexion: {
          text: "",
          click: deconnexionAppli,
        },
      },

      eventSources: [
        {
          events: function (fetchInfo, successCallback, failureCallback) {
            getEvents(code_ressource)
              .then(function (data) {
                const events = [];
                for (const key in data) {
                  if (data.hasOwnProperty(key)) {
                    const event = data[key];
                    events.push({
                      title: event.title,
                      start: event.start,
                      end: event.end,
                      description: event.description,
                      location: event.location,
                      allDay: false,
                    });
                  }
                }
                successCallback(events);
              })
              .catch(function (error) {
                console.error(
                  "Erreur lors du chargement des événements : ",
                  error
                );
                failureCallback(error);
              });
          },
        },
      ],

      eventClick: function (info) {
        // Titre de la modale
        const modalTitle = document.getElementById("modalTitle");
        modalTitle.textContent = info.event.title;

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

        const description = info.event.extendedProps.description || "";
        const lines = description.replace(/\\n/g, "\n").split("\n");

        const groups = lines[2] || "Aucune information";
        const teacher = lines[3] || "Aucune information";

        modalBody.innerHTML = `
                    <strong>Début :</strong> ${startDate} à ${startTime} <br>
                    <strong>Fin :</strong> ${endDate} à ${endTime} <br>
                    <strong>Enseignant :</strong> ${teacher} <br>
                    <strong>Groupe(s) :</strong> ${groups} <br>
                    <div class="d-flex justify-content-between align-items-center">
                    <span><strong>Lieu :</strong> ${
                      info.event.extendedProps.location || "Non spécifié"
                    }</span>
                    <button id="copie_info" class="btn btn-primary">Déplacer ce créneau</button>
                    </div>
                    `;
        const button = document.getElementById("copie_info");
        button.addEventListener("click", ajoutValeur);

        //ajout valeur dans formulaire

        const lieu = info.event.extendedProps.location
          ? info.event.extendedProps.location
          : "Non spécifié";

        function ajoutValeur() {
          const dates = document.querySelectorAll(
            'input[id*="datepickerFrom"]'
          );
          const now = new Date();

          dates.forEach((date) => {
            if (info.event.start > now) {
              date.value = creationDate(info.event.start);
            } else {
              date.value = creationDate(now);
            }
          });

          selectElement(lieu, "aucune préférence", "salle");
          selectElement(teacher, "aucune préférence", "prof");
          selectElement(groups, "aucune préférence", "groupe");

          modal.style.display = "none";
        }

        const modal = document.getElementById("calendarModal");
        modal.style.display = "block";
      },
    });

    return calendar;
  }

  function selectElement(source, defaultText, selectId) {
    const selects = document.querySelectorAll(`[id^="${selectId}"]`);

    selects.forEach((select) => {
      if (source === defaultText) {
        const element = document.createElement("option");
        element.textContent = defaultText;
        select.appendChild(element);
        element.selected = true;
      }
      let existOption = false;
      for (let i = 0; i < select.length; i++) {
        if (source !== defaultText && select[i].text === source) {
          select[i].selected = true;
          existOption = true;
          break;
        }
      }
      if (!existOption) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text === "aucune préférence") {
            select.options[i].selected = true;
          }
          found = true;
          break;
        }
      }
    });
  }

  function creationDate(edate) {
    let month = edate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = edate.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return edate.getFullYear() + "-" + month + "-" + day;
  }

  function loadGoogleCalendarEvents(calendar) {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 200,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items || [];
        const googleEvents = events.map((event) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          description: event.description || "",
          location: event.location || "",
          url: "",
          source: "google",
        }));

        googleEvents.forEach((event) => {
          calendar.addEvent(event);
        });
      })

      .catch((error) =>
        console.error(
          "Erreur lors du chargement des événements Google :",
          error
        )
      );
  }

  // Charge l'API Google Calendar
  function loadGoogleCalendarApi() {
    gapi.load("client", () => {
      gapi.client.load("calendar", "v3", () => {
        updateSigninStatus(!!gapi.client.getToken());
      });
    });
  }

  // Connexion
  function authClick() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id:
        "222740579168-1das3fdsgvl65fvskijg5t00er9h541h.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      auto_select: false,
      cancel_on_tap_outside: false,
      ux_mode: "popup",
      callback: (response) => {
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          fetch(
            "https://www.googleapis.com/calendar/v3/users/me/calendarList",
            {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              updateSigninStatus(true);
            })
            .catch((error) => {
              console.error("Erreur API Google Calendar :", error);
            });
        } else {
          console.warn("Aucun token reçu.");
        }
      },
    });

    tokenClient.requestAccessToken();
  }

  // Déconnexion
  function signoutClick() {
    calendarInstance.getEvents().forEach((event) => {
      if (event.extendedProps && event.extendedProps.source === "google") {
        event.remove();
      }
    });

    if (gapi.client && gapi.client.setToken) {
      gapi.client.setToken(null);
    }

    google.accounts.oauth2.revoke(localStorage.getItem("access_token"), () => {
      console.log("Token révoqué côté Google.");
    });

    // Supprimer access_token local si tu l’as stocké
    localStorage.removeItem("access_token");

    // Mettre à jour l’UI
    updateSigninStatus(false);
  }

  // Mise à jour l'interface
  function updateSigninStatus(isSignedIn) {
    if (!calendarInstance) {
      return;
    }

    calendarInstance.setOption("customButtons", {
      addCalendarButton: {
        text: isSignedIn
          ? "Se déconnecter de Google Calendar"
          : "Importer Google Calendar",
        click: function () {
          if (gapi.client.getToken()) {
            signoutClick();
          } else {
            authClick();
          }
        },
      },
      deconnexion: {
        text: "",
        click: deconnexionAppli,
      },
    });

    calendarInstance.render();
    document.querySelector(".fc-deconnexion-button").innerHTML =
      '<i class="bi bi-box-arrow-right"></i>';
    document
      .querySelector(".fc-deconnexion-button")
      .setAttribute("title", "Déconnexion");

    if (isSignedIn) {
      loadGoogleCalendarEvents(calendarInstance);
    }
  }

  calendarInstance = renderCalendarWithLocalEvents();
  calendarInstance.render();

  loadGoogleCalendarApi();

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

  return calendarInstance;
}

function recupEventsGoogle() {
  const googleEvents = calendarInstance.getEvents().filter((event) => {
    return event.extendedProps && event.extendedProps.source === "google";
  });

  const formattedEvents = googleEvents.map((event) => ({
    start: event.start.toISOString(),
    end: event.end ? event.end.toISOString() : null,
  }));

  return formattedEvents;
}

function deconnexionAppli() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");

  if (gapi.client.getToken() && gapi.client.getToken().access_token) {
    gapi.client.setToken(null);
    google.accounts.oauth2.revoke(token.access_token, () => {
      signoutClick();
    });
  }
  window.location.href = "src/pages/login.html";
}
