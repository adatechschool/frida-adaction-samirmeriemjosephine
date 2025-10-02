import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Connexion à PostgreSQL
const db = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API !");
});

//   Liste des bénévoles
app.get("/benevoles", async (req, res) => {
  try {
    const result = await db`SELECT * FROM benevoles  `;
    console.log(result);
    res.json(result);
    res.json(result.rows); //  renvoie db en format JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }

});

// Ajouter un nouveau bénévole
app.post("/benevoles", async (req, res) => {
  const { id, nom, prenom, nbr_points, nbr_dechets, ville } = req.body;
  if (!nom) return res.status(400).json({ error: "Le champ nom" });
  try {
    console.log(req.body);
    const result = await db.query(`
      INSERT INTO benevoles (id, nom, prenom, nbr_points,nbr_dechets,ville)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`, [id, nom, prenom, nbr_points, nbr_dechets, ville]);
    console.log("Nouveau bénévole ajouté :", result[0]);
    res.status(201).json(result[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Impossible d'ajouter le benevole" });
  }
});


// Supprimer un bénévole par nom et prénom
app.delete("/benevoles", async (req, res) => {
  const { nom, prenom } = req.body; // récupération depuis le body

  if (!nom && !prenom) {
    return res.status(400).json({ error: "Nom et prénom sont requis" });
  }
  try {
    const result = await db`
      DELETE FROM benevoles
      WHERE nom = ${nom} AND prenom = ${prenom}
      RETURNING *;
    `;
    if (result.length > 0) {
      res.status(200).json({ message: "Bénévole supprimé", data: result });
    } else {
      res.status(404).json({ error: "Bénévole introuvable" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});





// Mettre à jour un bénévole par id
app.put("/benevoles/:id", async (req, res) => {
  const { id } = req.params; // récupérer l'id de l'URL

  const { nom, prenom, nbr_points, nbr_dechets, ville } = req.body;

  // Vérifier que les champs nom et prénom sont présents
  if (!nom || !prenom) {
    return res.status(400).json({ error: "Les champs nom et prénom sont obligatoires" });
  }

  try {
    const result = await db`
      UPDATE benevoles
      SET 
          nom = ${nom},
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

    res.json(result[0]); // Retourne le bénévole mis à jour
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour du bénévole" });
  }
});



app.get("/collectes", async (req, res) => {
  try {
    const result = await db`SELECT * FROM collectes  `;
    console.log(result);
    res.json(result);
    res.json(result.rows); //  renvoie db en format JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }

});


app.post("/collectes", async (req, res) => {
  const { } = req.body;
  if (!nom) return res.status(400).json({ error: "Le champ nom" });
  try {
    console.log(req.body);
    const result = await db.query(`
      INSERT INTO collectes (id, nom, prenom, nbr_points,nbr_dechets,ville)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`, [id, nom, prenom, nbr_points, nbr_dechets, ville]);
    console.log("Nouveau bénévole ajouté :", result[0]);
    res.status(201).json(result[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Impossible d'ajouter le benevole" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
