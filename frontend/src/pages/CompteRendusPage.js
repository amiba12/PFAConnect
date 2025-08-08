import React, { useEffect, useState } from "react";
import api from "../api/axios";

function CompteRendusPage() {
  const [user, setUser] = useState(null);
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [compteRendus, setCompteRendus] = useState([]);
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Charger l'utilisateur
      const userResponse = await api.get("/users/me");
      const currentUser = userResponse.data;
      setUser(currentUser);
      
      if (currentUser.role === "ETUDIANT") {
        // Pour les étudiants : charger leur projet unique
        try {
          const projetResponse = await api.get("/projets/mon-projet");
          const projetData = projetResponse.data;
          if (projetData && projetData.id) {
            setSelectedProjet(projetData);
            await loadCompteRendusForProjet(projetData.id);
          } else {
            setError("Vous n'avez pas de projet.");
          }
        } catch (err) {
          console.error("Erreur chargement projet étudiant", err);
          setError("Erreur lors du chargement de votre projet.");
        }
      } else if (currentUser.role === "ENCADRANT") {
        // Pour les encadrants : charger tous leurs projets
        try {
          const projetsResponse = await api.get("/projets/encadrant/mes-projets");
          const projetsData = Array.isArray(projetsResponse.data) ? projetsResponse.data : [];
          setProjets(projetsData);
          console.log("📋 Projets encadrés chargés:", projetsData.length);
          
          if (projetsData.length > 0) {
            setSelectedProjet(projetsData[0]);
            await loadCompteRendusForProjet(projetsData[0].id);
          } else {
            setError("Vous n'encadrez aucun projet pour le moment.");
          }
        } catch (err) {
          console.error("Erreur chargement projets encadrant", err);
          setError("Erreur lors du chargement des projets encadrés.");
        }
      }
    } catch (err) {
      console.error("Erreur chargement utilisateur", err);
      setError("Impossible de charger vos informations. Veuillez vous reconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const loadCompteRendusForProjet = async (projetId) => {
    try {
      console.log("📋 Chargement des comptes-rendus pour le projet:", projetId);
      const compteRendusResponse = await api.get(`/compterendus/projet/${projetId}`);
      const compteRendusData = Array.isArray(compteRendusResponse.data) ? compteRendusResponse.data : [];
      console.log("📋 Comptes-rendus reçus:", compteRendusData.length);
      setCompteRendus(compteRendusData);
    } catch (err) {
      console.error("Erreur chargement comptes-rendus", err);
      setCompteRendus([]);
    }
  };

  const handleProjetChange = async (projetId) => {
    const projet = projets.find(p => p.id == projetId);
    if (projet) {
      setSelectedProjet(projet);
      await loadCompteRendusForProjet(projet.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenu || !selectedProjet) return;
    
    try {
      await api.post(`/compterendus/ajouter/${selectedProjet.id}`, { contenu });
      setContenu("");
      await loadCompteRendusForProjet(selectedProjet.id);
    } catch (err) {
      console.error("Erreur lors de l'ajout du compte-rendu:", err);
      alert("Erreur lors de l'ajout du compte-rendu. Veuillez réessayer.");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div style={{color:'red'}}>{error}</div>;
  }

  if (!selectedProjet) {
    return <div style={{color:'red'}}>Aucun projet sélectionné.</div>;
  }

  return (
    <div>
      <h2>Comptes-rendus de séance</h2>
      
      {user && user.role === "ENCADRANT" && projets.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Projet : </label>
          <select 
            value={selectedProjet.id} 
            onChange={(e) => handleProjetChange(e.target.value)}
            style={{ marginLeft: 10, padding: 5 }}
          >
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.titre}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {user && user.role === "ENCADRANT" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <h3>Ajouter un compte-rendu</h3>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Contenu du compte-rendu..."
            required
            style={{ width: '100%', height: 100, marginBottom: 10 }}
          />
          <button type="submit">Ajouter le compte-rendu</button>
        </form>
      )}
      
      {compteRendus.length === 0 && <p>Aucun compte-rendu disponible.</p>}
      <ul>
        {compteRendus.map((cr) => (
          <li key={cr.id}>
            <b>{new Date(cr.date).toLocaleString()} :</b> {cr.contenu} <span style={{ color: '#888' }}>(Encadrant : {cr.encadrant && cr.encadrant.nom})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompteRendusPage; 