const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const verifyToken = require('../middlwares/auth');
const verifyIsAdmin = require('../middlwares/verifyIsAdmin');

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: API pour gérer les données générales de l'application

 * /application:
 *   post:
 *     summary: Insère ou met à jour la date maximale
 *     tags: [Application]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - max_date
 *             properties:
 *               max_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *     responses:
 *       201:
 *         description: Date enregistrée avec succès
 *       400:
 *         description: Le champ max_date est requis
 *       500:
 *         description: Erreur lors de l'enregistrement de la date

 *   get:
 *     summary: Récupère la date maximale enregistrée
 *     tags: [Application]
 *     responses:
 *       200:
 *         description: Date maximale actuelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 max_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-08-01"
 *       500:
 *         description: Erreur serveur

 *   put:
 *     summary: Met à jour la date maximale
 *     tags: [Application]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - max_date
 *             properties:
 *               max_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *     responses:
 *       200:
 *         description: Date mise à jour avec succès
 *       400:
 *         description: Le champ max_date est requis
 *       500:
 *         description: Erreur lors de la mise à jour
 */

router.post('/', applicationController.insertMaxDate)
router.get('/', applicationController.getMaxDate)
router.put('/', verifyIsAdmin, applicationController.updateMaxDate)

module.exports = router;