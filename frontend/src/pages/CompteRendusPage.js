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
      const userResponse = await api.get("/users/me");
      const currentUser = userResponse.data;
      setUser(currentUser);
      if (currentUser.role === "ETUDIANT") {
        const projetResponse = await api.get("/projets/mon-projet");
        const projetData = projetResponse.data;
        if (projetData && projetData.id) {
          setSelectedProjet(projetData);
          await loadCompteRendusForProjet(projetData.id);
        } else {
          setError("Vous n'avez pas de projet.");
        }
      } else if (currentUser.role === "ENCADRANT") {
        const projetsResponse = await api.get("/projets/encadrant/mes-projets");
        const projetsData = Array.isArray(projetsResponse.data) ? projetsResponse.data : [];
        setProjets(projetsData);
        if (projetsData.length > 0) {
          setSelectedProjet(projetsData[0]);
          await loadCompteRendusForProjet(projetsData[0].id);
        } else {
          setError("Vous n'encadrez aucun projet pour le moment.");
        }
      }
    } catch (err) {
      setError("Impossible de charger vos informations. Veuillez vous reconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const loadCompteRendusForProjet = async (projetId) => {
    try {
      const compteRendusResponse = await api.get(`/compterendus/projet/${projetId}`);
      const compteRendusData = Array.isArray(compteRendusResponse.data) ? compteRendusResponse.data : [];
      setCompteRendus(compteRendusData);
    } catch (err) {
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
      alert("Erreur lors de l'ajout du compte-rendu");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!selectedProjet) return <div className="alert alert-warning">Aucun projet sélectionné.</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 m-0">Comptes-rendus de séance</h2>
              {user && user.role === "ENCADRANT" && projets.length > 0 && (
                <div className="d-flex align-items-center">
                  <label className="me-2">Projet</label>
                  <select className="form-select" style={{ width: 280 }} value={selectedProjet.id} onChange={(e) => handleProjetChange(e.target.value)}>
                    {projets.map((projet) => (
                      <option key={projet.id} value={projet.id}>{projet.titre}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {user && user.role === "ENCADRANT" && (
              <form onSubmit={handleSubmit} className="mb-3">
                <h3 className="h6">Ajouter un compte-rendu</h3>
                <textarea className="form-control mb-2" value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Contenu du compte-rendu..." required />
                <button type="submit" className="btn btn-primary">Ajouter</button>
              </form>
            )}

            <ul className="list-group">
              {compteRendus.map((cr) => (
                <li key={cr.id} className="list-group-item">
                  <b>{new Date(cr.date).toLocaleString()} :</b> {cr.contenu} <span className="text-muted">(Encadrant : {cr.encadrant && cr.encadrant.nom})</span>
                </li>
              ))}
              {compteRendus.length === 0 && <li className="list-group-item text-muted">Aucun compte-rendu disponible.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompteRendusPage; 