document.addEventListener("DOMContentLoaded", () => {
  const BASE = "http://localhost:3000/association";
  const tbody = document.querySelector("#tableAsso tbody");
  const totalContainer = document.getElementById("totauxBenevoles");

  try { 
    const debug = document.getElementById('debug');
    if (debug) debug.innerText = "Script tabord.js chargé";
  } catch {}

  // --- Charger les associations ---
  async function charger() {
    try {
      const res = await fetch(BASE);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Aucune association trouvée.</td></tr>`;
        return;
      }

      data.forEach(asso => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${asso.id ?? "—"}</td>
          <td>${asso.nom ?? "—"}</td>
          <td>${asso.description ?? "—"}</td>
          <td>${asso.nbr_benevoles ?? 0}</td>
          <td>${asso.argent ?? 0} €</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error("Erreur chargement des associations :", err);
      tbody.innerHTML = `<tr><td colspan="5">Erreur : ${err.message}</td></tr>`;
    }
  }

  // --- Récupérer et remplir les bénévoles ---
  async function compteurBenevoles() {
    try {
      const select = document.getElementById("select-personne");
      if (!select) return;

      const res = await fetch('http://localhost:3000/benevoles');
      if (!res.ok) throw new Error('Erreur récupération bénévoles ' + res.status);
      const benevoles = await res.json();

      select.innerHTML = Array.isArray(benevoles) 
        ? benevoles.map(b => `<option value="${b.nom}">${b.nom}</option>`).join('') 
        : '';

      if (Array.isArray(benevoles) && benevoles.length > 0) fillForm(benevoles[0]);

      select.addEventListener("change", async () => {
        const nom = select.value;
        try {
          const resB = await fetch(`http://localhost:3000/benevoles/${nom}`);
          if (!resB.ok) throw new Error('Bénévole non trouvé');
          const b = await resB.json();
          fillForm(b);
        } catch (e) {
          console.error('Erreur récupération bénévole par nom', e);
        }
      });
    } catch (err) {
      console.error("Erreur récupération bénévoles :", err);
    }
  }

  // --- Remplir formulaire bénévole ---
  const fillForm = (benevole) => {
    const setIf = (id, val, isInput = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (isInput) el.value = val ?? '';
      else el.innerText = val ?? 0;
    };
    setIf('megots', benevole.megots || 0);
    setIf('plastique', benevole.plastique || 0);
    setIf('verre', benevole.verre || 0);
    setIf('peche', benevole.peche || 0);
    setIf('cannette', benevole.cannette || 0);
    setIf('ville', benevole.ville || '', true);
  };

  // --- Modifier compteur de déchet ---
  function changerCompteur(id, valeur) {
    const compteur = document.getElementById(id);
    let nombre = parseInt(compteur.innerText);
    nombre += valeur;
    if (nombre < 0) nombre = 0;
    compteur.innerText = nombre;
  }

  // --- Bouton enregistrer mise à jour bénévole ---
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) registerBtn.addEventListener('click', async () => {
    try {
      const selectEl = document.getElementById('select-personne');
      const nom = selectEl ? selectEl.value : null;
      if (!nom) return alert("Sélectionner un bénévole");

      const getText = id => parseInt(document.getElementById(id)?.innerText || '0', 10) || 0;
      const megots = getText('megots');
      const plastique = getText('plastique');
      const verre = getText('verre');
      const peche = getText('peche');
      const cannette = getText('cannette');

      const nbr_points = megots*10 + plastique*30 + verre*20 + peche*15 + cannette*15;
      const nbr_dechets = megots + plastique + verre + peche + cannette;

      const resB = await fetch(`http://localhost:3000/benevoles/${nom}`);
      if (!resB.ok) throw new Error("Bénévole non trouvé");
      const benevole = await resB.json();
      const id = benevole.id;

      const data = { nom, nbr_points, nbr_dechets, megots, plastique, verre, peche, cannette, ville: document.getElementById('ville')?.value || '' };

      const resUpdate = await fetch(`http://localhost:3000/benevoles/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (!resUpdate.ok) throw new Error("Erreur mise à jour du bénévole");
      await resUpdate.json();
      alert("Bénévole mis à jour !");

      // 🔹 Mettre à jour les totaux globaux après modification
      await calculerEtAfficherTotaux();
      await compteurBenevoles(); 
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // --- Calculer et afficher les totaux globaux depuis la base ---
  async function calculerEtAfficherTotaux() {
    try {
      // Récupérer tous les bénévoles
      const resBenevoles = await fetch('http://localhost:3000/benevoles');
      const benevoles = await resBenevoles.json();
      const nbrBenevoles = benevoles.length;

      // Récupérer toutes les collectes
      const resCollectes = await fetch('http://localhost:3000/collectes');
      const collectes = await resCollectes.json();

      // Somme des quantités et points
      const totalDechets = collectes.reduce((sum, c) => sum + (c.quantite || 0), 0);
      const totalPoints = collectes.reduce((sum, c) => sum + (c.points_dechet || 0), 0);

      // Conversion points -> euros
      let totalEuros = 0;
      if(totalPoints >= 5000) totalEuros = 50;
      else if(totalPoints >= 2000) totalEuros = 20;
      else if(totalPoints >= 1000) totalEuros = 10;

      if(totalContainer) {
        totalContainer.innerHTML = `
          <div>Total bénévoles : ${nbrBenevoles}</div>
          <div>Total collectes : ${totalDechets}</div>
          <div>Total points : ${totalPoints}</div>
          <div>Total reversé en euros : ${totalEuros} €</div>
        `;
      }
    } catch(err) {
      console.error("Erreur calcul des totaux :", err);
    }
  }

  // --- Mettre à jour nombre de bénévoles dans l'association ---
  async function mettreAJourNbrBenevoles() {
    try {
      const resBenevoles = await fetch('http://localhost:3000/benevoles');
      const benevoles = await resBenevoles.json();
      const totalBenevoles = benevoles.length;

      const resAssoc = await fetch(BASE);
      const associations = await resAssoc.json();
      if (!associations || associations.length === 0) return;

      const assoc = associations[0];

      await fetch(BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: assoc.id, nbr_benevoles: totalBenevoles })
      });
    } catch (err) {
      console.error(err);
    }
  }

  // --- Initialisation ---
  charger();
  compteurBenevoles();
  calculerEtAfficherTotaux();
  mettreAJourNbrBenevoles();
});

// --- Navigation boutons ---
document.addEventListener('DOMContentLoaded', () => {
  const btnAccueil = document.getElementById('btn-accueil');
  const btnBenev = document.getElementById('btn-benev');

  if (btnAccueil) btnAccueil.addEventListener('click', () => { window.location.href = '../accueil/accueil.html'; });
  if (btnBenev) btnBenev.addEventListener('click', () => { window.location.href = '../benevliste/benevliste.html'; });
});
