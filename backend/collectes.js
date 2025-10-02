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
  console.log("Body reçu:", req.body);

  const { id_benevole, type_dechet, points_dechet, quantite, ville, date, nbr_pnt_type } = req.body;

  if (
    id_benevole == null ||
    !type_dechet ||
    points_dechet == null ||
    quantite == null ||
    !ville ||
    !date ||
    nbr_pnt_type == null
  ) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    const result = await db`
      INSERT INTO collectes (id_benevole, type_dechet, points_dechet, quantite, ville, date, nbr_pnt_type)
      VALUES (${id_benevole}, ${type_dechet}, ${points_dechet}, ${quantite}, ${ville}, ${date}, ${nbr_pnt_type})
      RETURNING *;
    `;

    console.log("Insertion OK :", result[0]);
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err);
    res.status(500).json({ error: "Impossible d'ajouter" });
  }
});


app.delete("/collectes/:id_benevole", async (req, res) => {
  const { id_benevole } = req.body;

  if (!id_benevole) {
    return res.status(400).json({ error: "Le paramètre id_benevole est requis" });
  }

  try {
    const result = await db`
      DELETE FROM collectes
      WHERE id_benevole = ${id_benevole}
      RETURNING *;
      `
    ;

    if (result.length > 0) {
      res.status(200).json({ message: "Collecte(s) supprimée(s)", data: result });
    } else {
      res.status(404).json({ error: "Aucune collecte trouvée pour ce bénévole" });
    }
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression des collectes" });
  }
});


app.put("/collectes/:id", async (req, res) => {
  const { id } = req.params;
  const { id_benevole, type_dechet, points_dechet, quantite, ville, date, nbr_pnt_type } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Le champ id est obligatoire" });
  }
  try {
    const result = await db.query(
      `UPDATE collectes 
          SET id_benevole = $1,
              type_dechet = $2,
              points_dechet = $3,
              quantite = $4,
              ville = $5,
              date = $6,
              nbr_pnt_type = $7
        WHERE id = $8
       RETURNING *`,
      [id_benevole, type_dechet, points_dechet, quantite, ville, date, nbr_pnt_type, id]
    );
    console.log(result);
    console.log(result[0]);
    if (!result || result.length === 0) {
      console.log(result);
      return res.status(404).json({ error: "Déchet introuvable" });
    
  }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour de la collecte" });
  }
});


     

