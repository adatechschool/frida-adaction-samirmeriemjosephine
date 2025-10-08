const benevolesGrid = document.getElementById("benevolesGrid");

// 🔹 1. Récupération et affichage des bénévoles
fetch("http://localhost:3000/benevoles")
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors de la récupération des bénévoles");
    return response.json();
  })
  .then(benevoles => {
    benevolesGrid.innerHTML = "";

    benevoles.forEach(b => {
      // Création de la carte du bénévole
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${b.nom} ${b.prenom}</h3>
        <p><strong>Ville :</strong> ${b.ville ?? '-'}</p>
        <p><strong>Points :</strong> ${b.nbr_points ?? 0}</p>
        <p><strong>Déchets collectés :</strong> ${b.nbr_dechets ?? 0}</p>
        <button class="btnDet" data-id="${b.id}">Détails</button>
        <button class="toggle-btn" data-id="${b.id}">Voir collectes</button>
      `;
      benevolesGrid.appendChild(card);
    });

    // 🎯 Gestion du bouton "Détails" (redirection)
    document.querySelectorAll(".btnDet").forEach(btnDet => {
      btnDet.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        window.location.href = `../benevdetail/benevdetail.html?id=${id}`;
      });
    });

    // 🔹 2. Chargement des collectes après affichage des bénévoles
    chargerCollectes();
  })
  .catch(err => console.error("❌ Erreur :", err));

// Fonction pour récupérer et afficher les collectes
function chargerCollectes() {
  fetch("http://localhost:3000/collectes")
    .then(response => {
      if (!response.ok) throw new Error("Erreur lors de la récupération des collectes");
      return response.json();
    })
    .then(collectes => {
      const toggleButtons = document.querySelectorAll(".toggle-btn");

      toggleButtons.forEach(btn => {
        btn.addEventListener("click", () => { 
          const card = btn.parentElement;
          const existingList = card.querySelector("ul");

          if (existingList) {
            // Masquer la liste
            existingList.remove();
            btn.textContent = "Voir collectes";
          } else {
            // Récupération de l'id du bénévole
            const id = btn.dataset.id;

            // Filtrer les collectes par bénévole
            const benevoleCollectes = collectes.filter(c => c.id_benevole == id);

            if (benevoleCollectes.length === 0) {
              const msg = document.createElement("p");
              msg.textContent = "Aucune collecte enregistrée.";
              msg.className = "no-collecte";
              card.appendChild(msg);
              btn.textContent = "Masquer";
              return;
            }

            // Regrouper les collectes par type de déchet
            const regroupees = {};
            benevoleCollectes.forEach(c => {
              if (!regroupees[c.type_dechet]) regroupees[c.type_dechet] = 0;
              regroupees[c.type_dechet] += c.quantite;
            });

            // Afficher les collectes
            const ul = document.createElement("ul");
            for (const type in regroupees) {
              const li = document.createElement("li");
              li.textContent = `${type} - ${regroupees[type]} kg`;
              ul.appendChild(li);
            }

            card.appendChild(ul);
            btn.textContent = "Masquer";
          }
        });
      });
    })
    .catch(err => console.error("❌ Erreur collectes :", err));
}
