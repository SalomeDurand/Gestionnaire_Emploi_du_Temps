const db = require('../configs/db');

const createRessource = (ressourceObj) => {
  return new Promise((resolve, reject) => {
    const { nom_ressource, type_ressource, code_ressource, details_ressource } = ressourceObj;

    if (!nom_ressource || !type_ressource || !code_ressource) {
      return reject(new Error('Champs requis manquants'));
    }

    const sql = 'INSERT INTO Ressource (nom_ressource, type_ressource, code_ressource, details_ressource) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom_ressource, type_ressource, code_ressource, details_ressource || null], (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId });
    });
  });
};

exports.createRessource = async (req, res) => {
  try {
    const result = await createRessource(req.body);
    res.status(201).json({ message: 'Ressource créée avec succès.', id: result.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erreur lors de la création de la ressource.' });
  }
};

exports.createRessources = async (req, res) => {
  try {
    const promises = req.body.map(obj => createRessource(obj));
    const results = await Promise.all(promises);
    res.status(201).json({ message: 'Ressources créées avec succès.', ids: results.map(r => r.id) });
  } catch (error) {
    console.error('Erreur globale lors de la création :', error.message);
    res.status(500).json({ message: 'Erreur lors de la création des ressources.' });
  }
};

exports.getAllRessources = (req, res) => {
  db.query('SELECT * FROM Ressource', (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des ressources.' });
    }
    res.status(200).json(result);
  });
};

exports.getRessourceById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM Ressource WHERE id_ressource = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la récupération de la ressource.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Ressource non trouvée.' });
    }
    res.status(200).json(result[0]);
  });
};

exports.getRessourceByType = (req, res) => {
  const { type_ressource } = req.params;

  db.query('SELECT * FROM Ressource WHERE type_ressource = ?', [type_ressource], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la récupération de la ressource.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Aucune ressource trouvée.' });
    }
    res.status(200).json(result);
  });
};

exports.updateRessource = (req, res) => {
  const { id } = req.params;
  const { nom_ressource, type_ressource, code_ressource, details_ressource } = req.body;
  
  const sql = 'UPDATE Ressource SET nom_ressource = ?, type_ressource = ?, code_ressource = ?, details_ressource = ? WHERE id_ressource = ?';
  db.query(sql, [nom_ressource, type_ressource, code_ressource, details_ressource, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la ressource.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ressource non trouvée.' });
    }
    res.status(200).json({ message: 'Ressource mise à jour avec succès.' });
  });
};

exports.deleteRessource = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM Ressource WHERE id_ressource = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la suppression de la ressource.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ressource non trouvée.' });
    }
    res.status(200).json({ message: 'Ressource supprimée avec succès.' });
  });
};


