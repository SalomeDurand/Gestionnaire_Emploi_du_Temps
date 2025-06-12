// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlwares/auth');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs

 * /users/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - nom_utilisateur
 *               - email
 *               - mot_de_passe
 *               - id_ressource
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               nom_utilisateur:
 *                 type: string
 *               email:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *                 default: false
 *               mot_de_passe:
 *                 type: string
 *               id_ressource:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Champs requis manquants
 *       500:
 *         description: Erreur serveur

 * /users/{id_user}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - nom_utilisateur
 *               - email
 *               - id_ressource
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               nom_utilisateur:
 *                 type: string
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               id_ressource:
 *                 type: integer
 *               code_ressource:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Champs requis manquants
 *       404:
 *         description: Utilisateur ou ressource non trouvé
 *       500:
 *         description: Erreur serveur
 * 
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       400:
 *         description: L'ID utilisateur est requis
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur

 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   nom_utilisateur:
 *                     type: string
 *                   email:
 *                     type: string
 *                   id_ressource:
 *                     type: integer
 *                   nom_ressource:
 *                     type: string
 *                   type:
 *                     type: string
 *                   code_ressource:
 *                     type: string
 *       500:
 *         description: Erreur serveur

 * /users/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_utilisateur
 *               - mot_de_passe
 *             properties:
 *               nom_utilisateur:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 utilisateur:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     nom_utilisateur:
 *                       type: string
 *                     code_ressource:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Champs requis manquants
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur

 * /users/available-slots:
 *   post:
 *     summary: Récupère les créneaux disponibles via ADE
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resources
 *               - firstDate
 *               - lastDate
 *               - importedEvents
 *             properties:
 *               resources:
 *                 type: string
 *               firstDate:
 *                 type: string
 *                 format: date
 *               lastDate:
 *                 type: string
 *                 format: date
 *               importedEvents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     end:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Créneaux disponibles renvoyés
 *       400:
 *         description: Paramètres requis manquants
 *       500:
 *         description: Erreur ADE
 * 
 * 
 * /users/events:
 *   get:
 *     summary: Récupère l'emploi du temps de l'utilisateur au format iCal
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: query
 *         name: resources
 *         required: true
 *         schema:
 *           type: string
 *         description: "Code ressource ADE (ex: 1035)"
 *       - in: query
 *         name: firstDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "Date de début au format AAAA-MM-JJ"
 *       - in: query
 *         name: lastDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "Date de fin au format AAAA-MM-JJ"
 *     responses:
 *       200:
 *         description: Succès - événements récupérés
 *         content:
 *           text/calendar:
 *             schema:
 *               type: string
 *               example: |
 *                 BEGIN:VCALENDAR
 *                 VERSION:2.0
 *                 BEGIN:VEVENT
 *                 DTSTART:20250509T080000Z
 *                 DTEND:20250509T100000Z
 *                 SUMMARY:S2.09 Virtualisation-TP ASPE-A
 *                 LOCATION:S24
 *                 END:VEVENT
 *                 END:VCALENDAR
 *       400:
 *         description: Paramètres manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required parameters
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur lors de la récupération des événements
 */

router.get('/', verifyToken, userController.getAllUsers);
router.post('/available-slots', verifyToken, userController.getAvailableSlots)
router.post('/register', userController.register)
router.post('/login',  userController.login)
router.get('/events', verifyToken, userController.getEvents)
router.put('/', verifyToken, userController.updateUser)
router.delete('/', verifyToken, userController.deleteUser)
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token valide', user: req.user });
  });

module.exports = router;
