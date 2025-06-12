const db = require('../configs/db');
const axios = require('axios');
const ical = require('ical');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (userObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { nom, prenom, nom_utilisateur, id_ressource, isAdmin, email, mot_de_passe } = userObj;

      if (!nom || !prenom || !nom_utilisateur || !email || !mot_de_passe || !id_ressource) {
        return reject({ status: 400, message: 'Tous les champs sont requis.' });
      }
        
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      let sql = `
        INSERT INTO User (nom, prenom, nom_utilisateur, email, id_ressource, mot_de_passe) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      let params = [nom, prenom, nom_utilisateur, email, id_ressource, hashedPassword];


      if(isAdmin) {
         sql = `
          INSERT INTO User (nom, prenom, nom_utilisateur, email, id_ressource, isAdmin, mot_de_passe) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
       params = [nom, prenom, nom_utilisateur, email, id_ressource, isAdmin, hashedPassword];

      }

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error('Erreur SQL:', err);
          return reject({ status: 500, message: 'Erreur lors de l’enregistrement.' });
        }

        return resolve({ status: 201, message: 'Utilisateur créé avec succès.', id: result.insertId });
      });
    } catch (error) {
      console.error('Erreur register:', error);
      return reject({ status: 500, message: 'Erreur serveur.' });
    }
  });
};


exports.register = async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json({ message: 'Utilisateur créée avec succès.', id: result.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erreur lors de la création utilisateur.' });
  }
};

exports.createUsers = async (req, res) => {
  try {
    const promises = req.body.map(obj => register(obj));
    const results = await Promise.all(promises);
    res.status(201).json({ message: 'Utilisateurs créées avec succès.', ids: results.map(r => r.id) });
  } catch (error) {
    console.error('Erreur globale lors de la création :', error.message);
    res.status(500).json({ message: 'Erreur lors de la création des utilisateurs.' });
  }
};


exports.updateUser = async (req, res) => {
  const { nom, prenom, nom_utilisateur, email, mot_de_passe, id_ressource, code_ressource } = req.body;
  const id_user  = req.user.id_user;

  if (!nom || !prenom || !nom_utilisateur || !email || !id_ressource  || code_ressource ) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Hacher le mot de passe
    let hashedPassword = null;
    if(mot_de_passe) hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    
  let sql = 'UPDATE user SET nom = ?, prenom = ?, nom_utilisateur = ?, email = ?, id_ressource = ? WHERE id_user = ?';
  let params = [nom, prenom, nom_utilisateur, email, id_ressource, id_user];

  if (hashedPassword) {
    sql = 'UPDATE user SET nom = ?, prenom = ?, nom_utilisateur = ?, email = ?, mot_de_passe = ?, id_ressource = ? WHERE id_user = ?';
    params = [nom, prenom, nom_utilisateur, email, hashedPassword, id_ressource, id_user];
  }
    db.query( sql,params,
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mettre à jour le code_ressource dans la table Ressource
        db.query(
          'UPDATE Ressource SET code_ressource = ? WHERE id_ressource = ?',
          [code_ressource, id_ressource],
          (err, resRessource) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Erreur lors de la mise à jour du code de la ressource.' });
            }

            // Si la ressource n'a pas été trouvée
            if (resRessource.affectedRows === 0) {
              return res.status(404).json({ message: 'Ressource non trouvée.' });
            }

            // Retourner la réponse avec les nouvelles informations
            res.status(200).json({
              message: 'Utilisateur et ressource mis à jour avec succès.',
              utilisateur: {
                id_user,
                nom,
                prenom,
                nom_utilisateur,
                email,
                id_ressource,
                code_ressource
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT u.*, r.nom_ressource, r.type, r.code_ressource
    FROM User u
    LEFT JOIN Ressource r ON u.id_ressource = r.id_ressource
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
};

exports.login = (req, res) => {
  const { nom_utilisateur, mot_de_passe } = req.body;

  if (!nom_utilisateur || !mot_de_passe) {
    return res.status(400).json({ message: 'Nom d’utilisateur et mot de passe requis.' });
  }

  const sql = `
    SELECT u.*, r.code_ressource
    FROM User u
    INNER JOIN Ressource r ON u.id_ressource = r.id_ressource
    WHERE u.nom_utilisateur = ?
  `;

  db.query(sql, [nom_utilisateur], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!match) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id_user: user.id_user, email: user.email, isAdmin:user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      utilisateur: {
        id_user: user.id_user,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        nom_utilisateur: user.nom_utilisateur,
        code_ressource: user.code_ressource
      },
      token
    });
  });
};

exports.deleteUser = (req, res) => {

  const sql = 'DELETE FROM user WHERE id_user = ?';

  db.query(sql, [req.user.id_user], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  });
};

exports.getAvailableSlots = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Paramètres requis dans le corps de la requête." });
    }
    
    const response = await axios.get('https://adelb.univ-lyon1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp', {

     // params: req.body,
        params: {
          resources: req.body.resources,
          projectId: 0,
          calType: 'ical',
          firstDate: req.body.firstDate,
          lastDate: req.body.lastDate,
       },
    });


    console.log('API Response:', response.data);
    const events = ical.parseICS(response.data);
    const eventsArray = Object.values(events);
    const importedEvents = req.body.importedEvents;
   for(ev of importedEvents) eventsArray.push(ev)

    eventsArray.sort((a,b) => new Date(a.start) - new Date(b.start));
    let availableSlots  = []
    const endRangeDate= new Date(req.body.lastDate).setHours(18);

  let debutJournee = true;
 for (let i = 0; i < eventsArray.length - 1 ; i++) {
  const currentEventStart = new Date(eventsArray[i].start);

   const currentEventEnd = new Date(eventsArray[i].end);
   const nextEventStart = new Date(eventsArray[i + 1].start);
   let startSlot;
   let endSlot;
   

   if(debutJournee && currentEventStart !== 8) {
    availableSlots.push({ start: new Date(currentEventStart).setHours(8), end: currentEventStart, resources: req.body.resources});
    debutJournee = false;
   }
  if (currentEventEnd < nextEventStart && currentEventEnd.getHours() !== 18) {  
       if (nextEventStart.getDay() != currentEventEnd.getDay()) {
        debutJournee = true;
         endSlot = new Date(currentEventEnd); 
         endSlot.setHours(18, 0, 0); 
       } else {
         endSlot = nextEventStart;
       }
      if(currentEventEnd.getHours == 0) currentEventEnd.setHours(8);
     availableSlots.push({ start: currentEventEnd, end: endSlot, resources: req.body.resources});
   }
 }

 // !! Affichage spécal côté front 
 if (eventsArray.length > 0 && eventsArray[eventsArray.length - 1].end < endRangeDate) {
   availableSlots.push({
       start: new Date(eventsArray[eventsArray.length - 1].end),
       end: new Date(endRangeDate),
      resources: req.body.resources
   });
}
    return res.json(availableSlots);

  } catch (error) {
    res.status(500).json({ error: 'Erreur à la récupération des emploi du temps' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { resources, firstDate, lastDate } = req.query;

    if (!resources || !firstDate || !lastDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get('https://adelb.univ-lyon1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp', {
      params: {
        resources,
        projectId: 0,
        calType: 'ical',
        firstDate,
        lastDate,
      },
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
};