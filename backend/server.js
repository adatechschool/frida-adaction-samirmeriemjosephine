import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import benevolesRoutes from "./benevole.js";

// Connexion à PostgreSQL
const db = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());

//const benevolesRouter = require('./benevole.js');

app.use('/benevoles', benevolesRoutes);


// route
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API !");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

