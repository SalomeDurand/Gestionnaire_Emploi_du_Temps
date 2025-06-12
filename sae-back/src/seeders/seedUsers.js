const axios = require('axios');

const users = [
    {
        nom: "Watrigant",
        prenom: "Remi",
        nom_utilisateur: "remi.watrigant",
        id_ressource: "81",
        email: "rEmi.watrigant@univ-lyon1.fr",
        mot_de_passe: "remi.watrigant"
      },
      {
        nom: "Busson",
        prenom: "Anthony",
        nom_utilisateur: "anthony.busson",
        id_ressource: "40",
        email: "anthony.busson@univ-lyon1.fr",
        mot_de_passe: "anthony.busson"
      },
      {
        nom: "TALL",
        prenom: "Macky",
        nom_utilisateur: "macky.tall",
        id_ressource: "126",
        email: "tallmacky001@gmail.com",
        mot_de_passe: "macky.tall",
        isAdmin:1
      }
];

const API_URL = 'http://localhost:3000/api/users/register';

async function seedUsers() {
  for (const user of users) {
    try {
      const res = await axios.post(API_URL, user);
      console.log(` Utilisateur ${user.nom_utilisateur} ajouté :`, res.data);
    } catch (err) {
      console.error(`Erreur pour ${user.nom_utilisateur} :`, err.response?.data || err.message);
    }
  }
}

seedUsers();
