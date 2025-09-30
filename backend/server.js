import express from "express";
import cors from "cors";
import {neon} from "@neondatabase/serverless";
import http from "node:http"
import { client } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Connexion à PostgreSQL
const client = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());



// import http from "node:http"
// const server = http.createServer((req, res) => {
// res.end("Adaction est une association qui sensibilise aux ramassages des déchets sauvages (mégots de cigarette, plastiques d’emballages, etc).");
// });



// Liste des bénévoles
app.get("/benevoles", async (req, res) => {
  try {
    const result = await client.query("SELECT id, nom, prenom, nbr_points, nbr_dechets, ville");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
