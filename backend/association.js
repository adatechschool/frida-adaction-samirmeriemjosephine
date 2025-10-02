app.get("/association", async (req, res) => {
  try {
    const result = await db`SELECT * FROM association `;
    console.log(result);
    res.json(result);
    res.json(result.rows); //  renvoie db en format JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }

});
