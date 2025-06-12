const db = require('../configs/db'); 

exports.insertMaxDate = (req, res) => {
  const { max_date } = req.body;
  if (!max_date) {
    return res.status(400).json({ message: 'Le champ max_date est requis.' });
  }
  const id_application = 1; 
  const sql = `
    INSERT INTO Application (id_application, max_date)
    VALUES (?, ?) `;

  db.query(sql, [id_application, max_date], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la date.' });
    }
    return res.status(201).json({ message: 'Date enregistrée avec succès.', max_date });
  });
};

exports.getMaxDate = (req, res) => {
    const sql = 'SELECT max_date FROM Application WHERE id_application = 1';
  
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json({ max_date: results[0].max_date });
    });
  };

  exports.updateMaxDate = (req, res) => {
    const { max_date } = req.body;
    if (!max_date) {
      return res.status(400).json({ message: 'Le champ max_date est requis.' });
    }
    const sql = 'UPDATE Application SET max_date = ? WHERE id_application = 1';
    db.query(sql, [max_date], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json({ message: 'Date mise à jour avec succès', max_date });
    });
  };
  
  