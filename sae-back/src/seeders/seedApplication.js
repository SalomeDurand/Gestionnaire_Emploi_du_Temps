const axios = require('axios');

const API_URL = 'http://localhost:3000/api/application'; 

const app = {
  max_date: "2025-08-01"
};

async function seedApplication() {
  try {
    await axios.post(API_URL, app);
    console.log(`Date max ${app.max_date} ajoutée`);
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err.response?.data || err.message);
  }
}

seedApplication();
