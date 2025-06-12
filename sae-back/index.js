require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { swaggerUi, swaggerSpec } = require('./src/configs/swaggerConfig');
const userRoutes = require('./src/routes/userRoutes');
const ressourceRoutes = require('./src/routes/ressourceRoutes');
const preferenceRoutes = require('./src/routes/preferenceRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');



app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/ressources', ressourceRoutes);
app.use('/api/preference', preferenceRoutes);
app.use('/api/application', applicationRoutes );




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

