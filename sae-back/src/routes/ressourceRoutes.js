const express = require('express');
const router = express.Router();
const ressourceController = require('../controllers/ressourceController');
const verifyToken = require('../middlwares/auth');
const verifyIsAdmin = require('../middlwares/verifyIsAdmin');

/**
 * @swagger
 * tags:
 *   name: Ressource
 *   description: Gestion des ressources
 *
 * /ressources:
 *   post:
 *     summary: Crée une ressource
 *     tags: [Ressource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_ressource
 *               - type_ressource
 *               - code_ressource
 *             properties:
 *               nom_ressource:
 *                 type: string
 *               type_ressource:
 *                 type: string
 *               code_ressource:
 *                 type: string
 *               details_ressource:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ressource créée avec succès
 *       500:
 *         description: Erreur serveur
 *
 *   get:
 *     summary: Récupère toutes les ressources
 *     tags: [Ressource]
 *     responses:
 *       200:
 *         description: Liste des ressources
 *       500:
 *         description: Erreur serveur
 *
 * /ressources/fixtures:
 *   post:
 *     summary: Crée plusieurs ressources
 *     tags: [Ressource]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - nom_ressource
 *                 - type_ressource
 *                 - code_ressource
 *               properties:
 *                 nom_ressource:
 *                   type: string
 *                 type_ressource:
 *                   type: string
 *                 code_ressource:
 *                   type: string
 *                 details_ressource:
 *                   type: string
 *     responses:
 *       201:
 *         description: Ressources créées avec succès
 *       500:
 *         description: Erreur serveur
 *
 * /ressources/{id}:
 *   get:
 *     summary: Récupère une ressource par ID
 *     tags: [Ressource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ressource trouvée
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Met à jour une ressource
 *     tags: [Ressource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_ressource:
 *                 type: string
 *               type_ressource:
 *                 type: string
 *               code_ressource:
 *                 type: string
 *               details_ressource:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ressource mise à jour
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprime une ressource
 *     tags: [Ressource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ressource supprimée
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *
 * /ressources/type/{type_ressource}:
 *   get:
 *     summary: Récupère les ressources par type
 *     tags: [Ressource]
 *     parameters:
 *       - in: path
 *         name: type_ressource
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des ressources par type
 *       404:
 *         description: Aucune ressource trouvée
 *       500:
 *         description: Erreur serveur
 */


router.post('/', verifyToken, ressourceController.createRessource);
router.post('/fixtures', verifyToken, ressourceController.createRessources);
router.get('/', verifyToken, ressourceController.getAllRessources);
router.get('/:id', verifyToken, ressourceController.getRessourceById);
router.get('/type/:type_ressource', verifyToken, ressourceController.getRessourceByType);
router.put('/:id',verifyIsAdmin , ressourceController.updateRessource); 
router.delete('/:id', verifyToken, ressourceController.deleteRessource);

module.exports = router;