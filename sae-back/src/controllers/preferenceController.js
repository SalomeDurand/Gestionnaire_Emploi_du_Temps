const db = require('../configs/db'); 

exports.createPreferences = (req, res) => {
  const { ressources } = req.body;
  if ( !ressources || !Array.isArray(ressources) || ressources.length === 0) {
    return res.status(400).json({ message: 'id_user et une liste de ressources sont requis.' });
  }

  const checkSql = 'SELECT COUNT(*) AS count FROM Preference WHERE id_user = ? AND code_ressource = ?';
  const insertSql = 'INSERT INTO Preference (id_user, code_ressource) VALUES (?, ?)';
  
  const insertPromises = ressources.map((ressource) => {
    return new Promise((resolve, reject) => {
      db.query(checkSql, [req.user.id_user, ressource], (err, result) => {
        if (err){
          console.error(`Erreur SQL lors de la vérification pour la ressource ${ressource}:`, err);
          return reject(err);
        }
        if (result[0].count > 0) {
          console.log(`La combinaison id_user=${req.user.id_user} et code_ressource=${ressource} existe déjà.`);
        resolve(result);
        }
        else{
          db.query(insertSql, [req.user.id_user, ressource], (err, result) => {
            if (err) {
              console.error(`Erreur SQL pour l'insertion de la ressource ${ressource}:`, err);
              return reject(err);
            }
            console.log(`Ressource insérée: ${ressource}`);
            resolve(result);
        });
        }
      });
    });
  });
  Promise.all(insertPromises)
    .then(() => res.status(201).json({ message: 'Préférences créées avec succès.' }))
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de la création des préférences.' });
    });
};

exports.getPreferenceByUser = (req, res) => {
  const sql =  `
    SELECT p.code_ressource, r.nom_ressource
    FROM Preference p
    JOIN Ressource r ON p.code_ressource = r.code_ressource
    WHERE p.id_user = ?;
  `;
  db.query(sql, [req.user.id_user], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des preferences.' });
    }
    res.status(200).json(results);
  });
};

exports.deletePreferences = (req, res) => {

  const sql = 'DELETE FROM Preference WHERE id_user = ?';

  db.query(sql, [req.user.id_user], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression des préférences :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression des préférences.' });
    }

    res.status(200).json({ message: 'Toutes les préférences ont été supprimées avec succès.' });
  });
};

exports.activatePreference = async (req, res) => {
  try {
    const sql = 'UPDATE user SET isPreferenceSet = true WHERE id_user = ?';
    db.query(sql, [req.user.id_user], (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
      }

      return res.status(200).json({ isPreferenceSet: true, message: 'Préférences activées.' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.desactivatePreference = async (req, res) => {
  try {
    const sql = 'UPDATE user SET isPreferenceSet = false WHERE id_user = ?';
    db.query(sql, [req.user.id_user], (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
      }

      return res.status(200).json({ PrefereisPreferenceSetnceIsSet: false, message: 'Préférences désactivées.' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
