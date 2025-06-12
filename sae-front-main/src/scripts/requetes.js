const api = "http://localhost:3000/api";
const token = localStorage.getItem("token");

function checkAuth() {
  if (!token) {
    window.location.href = "src/pages/login.html";
  }
  fetch(`${api}/users/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Token invalide");
      }
      return response.json();
    })
    .catch((err) => {
      alert("Votre session a expiré");
      localStorage.removeItem("token");
      window.location.href = "src/pages/login.html";
    });
}

const rechercherCreneau = async (paramsList) => {
  try {
    const data = [];
    for (let params of paramsList) {
      const res = await fetch(`${api}/users/available-slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        data.push(...(await res.json()));
      } else {
        alert(data.message || "Échec lors de la recherche");
      }
    }
    localStorage.setItem("resultats", JSON.stringify(data));
    hideLoader();
    window.location.href = "src/pages/resultats.html";
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue.");
        hideLoader();
  }
};

const getRessources = async () => {
  try {
    const res = await fetch(`${api}/ressources`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      alert(data.message || "Échec lors du chargement des ressources");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue.");
  }
};

const connexion = async () => {
  const nom_utilisateur = document.querySelector("#nom_utilisateur").value;
  const mot_de_passe = document.querySelector("#mot_de_passe").value;

  try {
    const res = await fetch(`${api}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom_utilisateur, mot_de_passe }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.utilisateur));

      const decodedToken = jwt_decode(data.token);
      const isAdmin = decodedToken.isAdmin;

      if (isAdmin) {
        window.location.href = "../pages/admin.html";
      } else {
        window.location.href = "../../index.html";
      }
    } else {
      alert(data.message || "Échec de la connexion");
    }
  } catch (error) {
    console.error("Erreur réseau :", error.message);
    alert("Une erreur est survenue.");
  }
};

const parseICS = (icsText) => {
  const events = [];
  const vevents = icsText.split("BEGIN:VEVENT");

  vevents.forEach((vevent) => {
    const summary = extractField(vevent, "SUMMARY");
    const dtstart = extractField(vevent, "DTSTART");
    const dtend = extractField(vevent, "DTEND");
    const location = extractField(vevent, "LOCATION");
    const description = extractField(vevent, "DESCRIPTION");

    if (summary && dtstart && dtend) {
      events.push({
        title: summary,
        start: formatDateTime(dtstart),
        end: formatDateTime(dtend),
        description,
        location,
        allDay: false,
      });
    }
  });

  return events;
};

const extractField = (text, field) => {
  const match = text.match(new RegExp(`${field}(:|;[^\\n]*)\\n?([^\n\r]*)`));
  return match ? match[2].trim() : null;
};

const formatDateTime = (icsDate) => {
  // Format attendu : 20250505T080000Z ou 20250505T080000
  const dt = icsDate.replace(/Z$/, "");
  const year = dt.slice(0, 4);
  const month = dt.slice(4, 6);
  const day = dt.slice(6, 8);
  const hour = dt.slice(9, 11);
  const min = dt.slice(11, 13);
  const sec = dt.slice(13, 15) || "00";

  return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`);
};

const getEvents = async (code_ressource) => {
  const firstDate = "2024-05-05";
  const lastDate = "2025-05-09";
  try {
    const res = await fetch(
      `${api}/users/events?resources=${code_ressource}&firstDate=${firstDate}&lastDate=${lastDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const icsText = await res.text();
    const events = parseICS(icsText);
    if (res.ok) {
      return events;
    } else {
      alert(data.message || "Échec lors du chargement des ressources");
      throw new Error("Échec lors du chargement des ressources");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue.");
    throw error;
  }
};

const getUserPreferences = async () => {
  try {
    const res = await fetch(`${api}/preference`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return data;
    } else {
      alert(data.message || "Échec lors du chargement des preferences");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue 2.");
  }
};

const createUserPreferences = async (ressources) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPreferenceSet = user.isPreferenceSet;

  const payload = {
    id_user: user.id_user,
    ressources: ressources,
  };

  try {
    const res = await fetch(`${api}/preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      if (!isPreferenceSet) {
        await activateUserPreference();
      }
      //alert("Préférences sauvegardées avec succès"); - redondant avec message côté front
    } else {
      alert(data.message || "Échec lors du chargement des preferences");
    }
  } catch (error) {
    alert("Une erreur est survenue 3.");
  }
};

const deleteUserPreferences = async (noPreferenceChecked) => {
  try {
    const res = await fetch(`${api}/preference`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (res.ok) {
      if (noPreferenceChecked) {
        await desactivateUserPreference();
      }
      //alert("Toutes les préférences ont été supprimées avec succès."); - pas besoin pour l'utilisateur
    } else {
      alert(data.message || "Échec lors de la suppression des preferences");
    }
  } catch (error) {
    alert("Une erreur est survenue 4.");
  }
};

const activateUserPreference = async () => {
  try {
    const res = await fetch(`${api}/preference/activate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      return true;
    } else {
      alert(data.message || "Échec");
    }
  } catch (error) {
    alert("Une erreur est survenue 5.");
  }
};

const desactivateUserPreference = async () => {
  try {
    const res = await fetch(`${api}/preference/desactivate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      return true;
    } else {
      alert(data.message || "Échec");
    }
  } catch (error) {
    alert("Une erreur est survenue 6.");
  }
};

const getDonnesApplication = async () => {
  try {
    const res = await fetch(`${api}/application`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("max_date", data.max_date);
      return data;
    } else {
      alert(data.message || "Échec");
    }
  } catch (error) {
    alert("Une erreur est survenue.");
  }
};

const updateDonnesApplication = async (max_date) => {
  try {
    const res = await fetch(`${api}/application`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ max_date }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("max_date", data.max_date);
      return data;
    } else {
      alert(data.message || "Échec");
    }
  } catch (error) {
    alert("Une erreur est survenue.");
  }
};
