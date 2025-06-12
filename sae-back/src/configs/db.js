require('dotenv').config();
var mysql = require('mysql2');

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la BDD:', err);
    return;
  }
  console.log('Connecté à la BDD');
});

module.exports = connection;