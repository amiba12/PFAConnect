import React, { useEffect, useState } from "react";
import api from "../api/axios";
console.log("📍 Tu es dans ProjetEncadrePage");

function ProjetEncadrePage() {
  const [projets, setProjets] = useState([]);
  const [compteRendu, setCompteRendu] = useState({ projetId: "", contenu: "" });
  const [statut, setStatut] = useState({ projetId: "", statut: "EN_COURS" });
  const [message, setMessage] = useState("");
  // Ajout pour création de projet partagé
  const [groupes, setGroupes] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [etudiantsGroupe, setEtudiantsGroupe] = useState([]);
  const [selectedEtudiants, setSelectedEtudiants] = useState([]);
  const [formProjet, setFormProjet] = useState({ titre: "", description: "", technologies: "", dateDebut: "", dateFin: "", organisme: "" });
  const [mode, setMode] = useState("nouveau");
  const [referenceEtudiant, setReferenceEtudiant] = useState("");

  useEffect(() => {
    fetchProjets();
    // Charger les groupes de l'encadrant
    api.get("/groupes/mes-groupes").then(res => setGroupes(res.data));
  }, []);

  const fetchProjets = () => {
    api.get("/projets/encadrant/mes-projets")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProjets(res.data);
        } else {
          setProjets([]);
          setMessage("Aucun projet trouvé ou erreur de chargement.");
        }
      })
      .catch(() => {
        setProjets([]);
        setMessage("Erreur lors du chargement des projets.");
      });
  };

  // Charger les étudiants du groupe sélectionné
  useEffect(() => {
    if (selectedGroupe) {
      api.get(`/groupes/${selectedGroupe}/etudiants`).then(res => setEtudiantsGroupe(res.data));
    } else {
      setEtudiantsGroupe([]);
    }
    setSelectedEtudiants([]);
  }, [selectedGroupe]);

  const handleAddCompteRendu = async (e) => {
    e.preventDefault();
    await api.post(`/compterendus/ajouter/${compteRendu.projetId}`, { contenu: compteRendu.contenu });
    setMessage("Compte-rendu ajouté");
    setCompteRendu({ projetId: "", contenu: "" });
  };

  const handleChangeStatut = async (e) => {
    e.preventDefault();
    await api.put(`/projets/${statut.projetId}/changer-statut?statut=${statut.statut}`);
    setMessage("Statut mis à jour");
    setStatut({ projetId: "", statut: "EN_COURS" });
    fetchProjets();
  };

  // Création projet partagé
  const handleChangeProjet = (e) => {
    setFormProjet({ ...formProjet, [e.target.name]: e.target.value });
  };
  const handleSelectEtudiant = (e) => {
    const value = e.target.value;
    setSelectedEtudiants(prev => prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]);
  };
  const handleCreateProjet = async (e) => {
    e.preventDefault();
    if (!selectedGroupe || selectedEtudiants.length === 0) {
      setMessage("Sélectionnez un groupe et au moins un étudiant");
      return;
    }
    try {
      const body = {
        etudiantsIds: selectedEtudiants,
        groupeId: selectedGroupe,
        mode,
        referenceEtudiantId: mode === "fusion" ? referenceEtudiant : undefined,
        ...formProjet
      };
      await api.post("/projets/creer-par-encadrant", body);
      setMessage("Projet partagé créé !");
      setFormProjet({ titre: "", description: "", technologies: "", dateDebut: "", dateFin: "", organisme: "" });
      setSelectedEtudiants([]);
      setReferenceEtudiant("");
      fetchProjets();
    } catch (err) {
      setMessage("Erreur lors de la création du projet partagé");
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
      <h2 className="h4 mb-3">Projets encadrés</h2>
      {message && <p className="alert alert-info py-2">{message}</p>}

      {/* Formulaire création projet partagé */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Créer un projet partagé (binôme/trinôme/monome)</h3>
          <form onSubmit={handleCreateProjet}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Mode de création</label>
                <select className="form-select" value={mode} onChange={e => setMode(e.target.value)}>
                  <option value="nouveau">Créer un nouveau projet partagé</option>
                  <option value="fusion">Garder le projet d'un étudiant comme projet partagé</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Groupe</label>
                <select className="form-select" value={selectedGroupe} onChange={e => setSelectedGroupe(e.target.value)} required>
                  <option value="">Sélectionner un groupe</option>
                  {groupes.map((g, idx) => <option key={String(g.id) + '-' + idx} value={g.id}>{g.nom}</option>)}
                </select>
              </div>
            </div>

            {etudiantsGroupe.length > 0 && (
              <div className="mt-3">
                <label className="form-label d-block">Étudiants (sélection multiple possible)</label>
                {etudiantsGroupe.map((e, idx) => (
                  <label key={String(e.id) + '-' + idx} className="me-3">
                    <input className="form-check-input me-1" type="checkbox" value={e.id} checked={selectedEtudiants.includes(String(e.id))} onChange={handleSelectEtudiant} />
                    {e.nom} ({e.email})
                  </label>
                ))}
              </div>
            )}

            {mode === "fusion" && selectedEtudiants.length > 0 && (
              <div className="mt-3">
                <label className="form-label">Étudiant de référence (dont on garde le projet)</label>
                <select className="form-select" value={referenceEtudiant} onChange={e => setReferenceEtudiant(e.target.value)} required>
                  <option value="">Sélectionner un étudiant</option>
                  {selectedEtudiants.map(id => {
                    const etu = etudiantsGroupe.find(e => String(e.id) === String(id));
                    return etu ? <option key={id} value={id}>{etu.nom} ({etu.email})</option> : null;
                  })}
                </select>
              </div>
            )}

            {mode === "nouveau" && (
              <div className="row g-2 mt-3">
                <div className="col-md-4"><input className="form-control" name="titre" placeholder="Titre" value={formProjet.titre} onChange={handleChangeProjet} required /></div>
                <div className="col-md-8"><input className="form-control" name="description" placeholder="Description" value={formProjet.description} onChange={handleChangeProjet} required /></div>
                <div className="col-md-6"><input className="form-control" name="technologies" placeholder="Technologies" value={formProjet.technologies} onChange={handleChangeProjet} required /></div>
                <div className="col-md-3"><input className="form-control" name="dateDebut" type="date" value={formProjet.dateDebut} onChange={handleChangeProjet} required /></div>
                <div className="col-md-3"><input className="form-control" name="dateFin" type="date" value={formProjet.dateFin} onChange={handleChangeProjet} required /></div>
                <div className="col-md-6"><input className="form-control" name="organisme" placeholder="Organisme" value={formProjet.organisme} onChange={handleChangeProjet} /></div>
              </div>
            )}

            <button type="submit" className="btn btn-primary mt-3">Créer projet partagé</button>
          </form>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Ajouter un compte-rendu</h3>
              <form onSubmit={handleAddCompteRendu}>
                <div className="row g-2">
                  <div className="col-12">
                    <select className="form-select" onChange={e => setCompteRendu({ ...compteRendu, projetId: e.target.value })} value={compteRendu.projetId}>
                      <option value="">Sélectionner un projet</option>
                      {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <textarea className="form-control" onChange={e => setCompteRendu({ ...compteRendu, contenu: e.target.value })} value={compteRendu.contenu} placeholder="Contenu du compte-rendu" required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">Ajouter</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Mettre à jour le statut d'un projet</h3>
              <form onSubmit={handleChangeStatut}>
                <div className="row g-2">
                  <div className="col-12">
                    <select className="form-select" onChange={e => setStatut({ ...statut, projetId: e.target.value })} value={statut.projetId}>
                      <option value="">Sélectionner un projet</option>
                      {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <select className="form-select" onChange={e => setStatut({ ...statut, statut: e.target.value })} value={statut.statut}>
                      <option value="EN_COURS">En cours</option>
                      <option value="TERMINE">Terminé</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-warning">Mettre à jour</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Liste des projets</h3>
          <div className="row g-3">
            {Array.isArray(projets) && projets.map((p, idx) => (
              <div className="col-md-6 col-lg-4" key={String(p.id) + '-' + idx}>
                <div className="card h-100">
                  <div className="card-body">
                    <h4 className="h6 mb-2">{p.titre}</h4>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      Étudiants : {p.etudiants ? p.etudiants.map(e => e.nom).join(", ") : "-"}<br/>
                      Statut : {p.statut}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!Array.isArray(projets) || projets.length === 0 ? <p className="mt-2">Aucun projet trouvé.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default ProjetEncadrePage; 