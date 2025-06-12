const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const verifyToken = require('../middlwares/auth');

/**
 * @swagger
 * tags:
 *   name: preference
 *   description: API de gestion des préférences

  * /preference:
 *   post:
 *     summary: Crée des préférences pour un utilisateur
 *     tags: [preference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_user
 *               - ressources
 *             properties:
 *               id_user:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               ressources:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Liste des ID de ressources à associer
 *     responses:
 *       201:
 *         description: Préférences créées avec succès
 *       400:
 *         description: Champs manquants
 *       500:
 *         description: Erreur serveur


 *   get:
 *     summary: Récupère les préférences d’un utilisateur (via token)
 *     tags: [preference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des préférences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Aucune préférence trouvée
 *       500:
 *         description: Erreur serveur

  *   delete:
 *     summary: Supprime des préférences pour un utilisateur
 *     tags: [preference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_user
 *               - ressources
 *             properties:
 *               id_user:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               ressources:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Liste des ID de ressources à supprimer
 *     responses:
 *       200:
 *         description: Préférences supprimées
 *       400:
 *         description: Champs manquants
 *       404:
 *         description: Aucune préférence trouvée
 *       500:
 *         description: Erreur serveur


 * /preference/activate:
 *   put:
 *     summary: Active le statut "isPreferenceSet" d’un utilisateur
 *     tags: [preference]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préférences activées
 *       400:
 *         description: ID manquant
 *       500:
 *         description: Erreur serveur

 * /preference/desactivate:
 *   put:
 *     summary: Désactive le statut "isPreferenceSet" d’un utilisateur
 *     tags: [preference]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Préférences désactivées
 *       400:
 *         description: ID manquant
 *       500:
 *         description: Erreur serveur
 */

router.post('/', verifyToken, preferenceController.createPreferences);
router.get('/', verifyToken, preferenceController.getPreferenceByUser);
router.delete('/', verifyToken, preferenceController.deletePreferences);
router.put('/activate', verifyToken, preferenceController.activatePreference)
router.put('/desactivate', verifyToken, preferenceController.desactivatePreference)

module.exports = router;
