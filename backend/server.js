import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Connexion à PostgreSQL
// const db = neon(process.env.DATABASE_URL);
// const app = express();
// app.use(cors());
// app.use(express.json());

// Vérification de la variable d'environnement
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL non définie dans .env");
}

// Connexion à la base
const db = neon(process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

// Route GET /benevoles
app.get("/benevoles", async (req, res) => {
  try {
    const result = await db `SELECT * FROM benevoles`;
    res.json(result); // <- result est un array (normalement)
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des bénévoles" });
  }
});




// route
// app.get("/", (req, res) => {
//   res.send("Bienvenue sur l'API !");
// });

// //   Liste des bénévoles
// app.get("/benevoles", async (req, res) => {
//   try {
//     const result = await db`SELECT * FROM benevoles  `;
//     console.log(result);
//     res.json(result.rows); //  renvoie db en format JSON
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }

// });

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
// Supprimer un bénévole par prénom
// app.delete("/benevoles/:prenom", async (req, res) => {
//   const prenom = req.params.prenom;
//   try {
//     // Recherche du bénévole par prénom
//     const result = await db.query("SELECT * FROM benevoles WHERE prenom = $1", [prenom]);
//     if (!result.rows || result.rows.length === 0) {
//       return res.status(404).json({ error: "Bénévole introuvable" });
//     }
//     const benevole = result.rows[0];
//     // Suppression par id
//     await db.query("DELETE FROM benevoles WHERE id = $1", [benevole.id]);
//     res.json({ message: "Bénévole supprimé", benevole });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur suppression du bénévole" });
//   }
// });


// Supprimer un ou plusieurs bénévoles par nom
app.delete("/benevoles", async (req, res) => {
  const {nom} = req.body;
  console.log(req.body);
  if (!nom) {
    return res.status(400).json({ error: "Nom requis" });
  }

  try {
    console.log("Nom reçu pour suppression :", nom);
    const result = await db.query(
      "DELETE FROM benevoles WHERE nom = $1 RETURNING *;",
      [nom]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aucun bénévole trouvé avec ce nom" });
    }

    res.json({ message: `${result.rows.length} bénévole(s) supprimé(s)`, benevoles: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression du bénévole" });
  }
});




// Mettre à jour un bénévole par nom et prénom
app.put("/benevoles/:id", async (req, res) => {
  const { nom, prenom, nbr_points, nbr_dechets, ville } = req.body;
  const id = req.params.id;
  console.log("id reçu pour mise à jour :", id);

  if (!nom || !prenom) {
    return res.status(400).json({ error: "Les champs nom et prénom sont obligatoires" });
  }
  try {
    const result = await db.query(
      "UPDATE benevoles SET nom = $1, prenom = $2, nbr_points = $3, nbr_dechets = $4, ville = $5 WHERE id = $6 RETURNING *;",
      [nom, prenom, nbr_points, nbr_dechets, ville, id]
    );
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Bénévole introuvable" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour du bénévole" });
  }
});


// Route pour mettre à jour un bénévole
// app.put("/benevoles/:id", async (req, res) => {
//     const { id } = req.params;
//     const { nom, prenom, nbr_points, nbr_dechets, ville} = req.body;
//     try {
//         const result = await sql.query(
//             "UPDATE benevoles SET nom = $1, prenom = $2, nbr_points = $3, nbr_dechets = $4, ville = $5, RETURNING *",
//             [nom, prenom, nbr_points, nbr_dechets, ville]
//         );
//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Bénévole non trouvé" });
//         }
//         res.json(result.rows[0]);
//     } catch (e) {
//         res.status(500).json({ error: "Impossible de mettre à jour le bénévole" });
//     }
// });





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
