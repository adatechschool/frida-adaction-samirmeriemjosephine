// extentions
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
<<<<<<< HEAD
import "dotenv/config";


// Connexion à PostgreSQL
=======
// import pkg from "pg";
// import http from "node:http";
import dotenv from "dotenv";
dotenv.config();


>>>>>>> a616106528b04dae9f16dd01edca0f986d18396c
const db = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());
const result = await db `SELECT version()`;
console.log(result);

  // route
  app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API !");
  });

<<<<<<< HEAD
//   Liste des bénévoles
app.get("/benevoles", async (req, res) => {
  try {
    const result = await db`SELECT * FROM benevoles  `;
    console.log( result);
    res.json(result); 
    res.json(result.rows); //  renvoie db en format JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
  
});



app.post("/benevoles", async (req, res) => {
  const { nom,prenom , nbr_points,nbr_dechets,ville } = req.body;
  if (!nom) return res.status(400).json({ error: "Le champ nom" });
  try {
    const result = await db`
      INSERT INTO benevoles (nom, prenom, nbr_points,nbr_dechets,ville)
      VALUES (${nom}, ${prenom}, ${nbr_points}, ${nbr_dechets}, ${ville})
      RETURNING *;
    `;
      console.log("Nouveau bénévole ajouté :", result[0]);
    res.status(201).json(result[0]);
  } catch {
    res.status(500).json({ error: "Impossible d'ajouter le benevole" });
  }
});

/*app.put("/benevoles/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, nbr_points, nbr_dechets, ville } = req.body;

  // Vérifier que le champ "nom" est présent (comme dans ton POST)
  if (!nom) {
    return res.status(400).json({ error: "Le champ nom est obligatoire" });
  }

  try {
    const result = await db`
      UPDATE benevoles
      SET nom = ${nom},
          prenom = ${prenom},
          nbr_points = ${nbr_points},
          nbr_dechets = ${nbr_dechets},
          ville = ${ville}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Bénévole introuvable" });
    }

    res.json(result[0]); //   Retourne le bénévole mis à jour
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour du bénévole" });
  }
});




*/
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
=======
// create root acceuil
app.get("/", (req, res) => {
    res.send("Hello World!");
    console.log(app.get);
})


// Get all bénévoles
app.get("/benevoles", async (req, res) => {
    try {
    const result = await db `SELECT * FROM benevoles`;
    console.log(result)
    res.json(result);
} catch (error) {
    console.error("Erreur lors de la récupération des bénévoles :", error);
    res.status(500).json({ error: "Erreur serveur" });
}}
);


// écoute du serveur
app.listen(3000, () => {
    console.log("Application exemple à l'écoute sur le port http://localhost:3000");
});


>>>>>>> a616106528b04dae9f16dd01edca0f986d18396c
