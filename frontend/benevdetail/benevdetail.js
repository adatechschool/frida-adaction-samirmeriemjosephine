// Récupère l'id depuis l'URL (ex: ?id=2)
const params = new URLSearchParams(window.location.search);
const idBenevole = params.get("id");

const tableBody = document.getElementById("historique-body");
const h2 = document.getElementById("nomBenevole"); // titre pour le nom du bénévole

// Points par type de déchet
const pointsParType = {
  "megots": 10,
  "plastique": 30,
  "verre": 20,
  "peche": 15,
  "cannette": 15
};

// Si aucun ID n’est fourni dans l’URL
if (!idBenevole) {
  h2.textContent = "❌ ID de bénévole non fourni dans l'URL";
  tableBody.innerHTML = `<tr><td colspan="5">Impossible de charger les données.</td></tr>`;
} else {
  loadBenevoleHistorique(idBenevole);
}

// ⚡ Fonction pour charger et afficher l’historique du bénévole
async function loadBenevoleHistorique(idBenevole) {
  try {
    // 1️⃣ Récupérer les infos du bénévole
    const resBenevole = await fetch(`http://localhost:3000/benevoles/${idBenevole}`);
    if (!resBenevole.ok) throw new Error("Erreur API bénévole");

    const benevole = await resBenevole.json();
    if (!benevole.nom) {
      h2.textContent = "❌ Bénévole introuvable";
      return;
    }

    const villeBenevole = benevole.ville || "Inconnue";
    h2.textContent = `Détails du bénévole : ${benevole.nom} ${benevole.prenom || ""}`;

    // 2️⃣ Récupérer toutes les collectes
    const resCollectes = await fetch("http://localhost:3000/collectes");
    if (!resCollectes.ok) throw new Error("Erreur API collectes");
    const collectes = await resCollectes.json();

    // 3️⃣ Filtrer les collectes du bénévole
    const collectesFiltrees = collectes.filter(c => String(c.id_benevole) === String(idBenevole));

    if (collectesFiltrees.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">Aucune collecte pour ce bénévole</td></tr>`;
      return;
    }

    // 4️⃣ Afficher les collectes
    tableBody.innerHTML = "";
    for (const c of collectesFiltrees) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(c.date).toLocaleDateString()}</td>
        <td>${c.type_dechet}</td>
        <td>
          <button class="moins">-</button>
          <span class="quantite">${c.quantite}</span>
          <button class="plus">+</button>
        </td>
        <td class="points">${c.points_dechet}</td>
        <td>${villeBenevole}</td>
      `;
      tableBody.appendChild(row);

      // Gestion des boutons + et -
      const btnPlus = row.querySelector(".plus");
      const btnMoins = row.querySelector(".moins");
      const spanQuantite = row.querySelector(".quantite");
      const tdPoints = row.querySelector(".points");

      btnPlus.addEventListener("click", async () => {
        let quantite = Number(spanQuantite.innerText) + 1;
        spanQuantite.innerText = quantite;
        tdPoints.innerText = quantite * pointsParType[c.type_dechet];
        await updateCollecte(c.id_benevole, c.type_dechet, 1);
      });

      btnMoins.addEventListener("click", async () => {
        let quantite = Number(spanQuantite.innerText);
        if (quantite > 0) {
          quantite -= 1;
          spanQuantite.innerText = quantite;
          tdPoints.innerText = quantite * pointsParType[c.type_dechet];
          await updateCollecte(c.id_benevole, c.type_dechet, -1);
        }
      });
    }

  } catch (err) {
    console.error("Erreur :", err);
    h2.textContent = "❌ Erreur lors du chargement du bénévole ou des collectes";
    tableBody.innerHTML = `<tr><td colspan="5">Impossible d'afficher les données.</td></tr>`;
  }
}

// ⚙️ Met à jour la collecte côté backend
async function updateCollecte(id_benevole, type_dechet, delta) {
  try {
    await fetch("http://localhost:3000/collectes/update", {
      method: "POST", // ou PUT selon ton backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_benevole, type_dechet, delta })
    });
  } catch (err) {
    console.error("Erreur mise à jour collecte :", err);
  }
}
