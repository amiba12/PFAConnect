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
    <div>
      <h2>Projets encadrés</h2>
      {message && <p>{message}</p>}

      {/* Formulaire création projet partagé */}
      <h3>Créer un projet partagé (binôme/trinôme/monome)</h3>
      <form onSubmit={handleCreateProjet} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 20 }}>
        <div>
          <label>Mode de création : </label>
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ marginRight: 10 }}>
            <option value="nouveau">Créer un nouveau projet partagé</option>
            <option value="fusion">Garder le projet d'un étudiant comme projet partagé</option>
          </select>
        </div>
        <div>
          <label>Groupe : </label>
          <select value={selectedGroupe} onChange={e => setSelectedGroupe(e.target.value)} required>
            <option value="">Sélectionner un groupe</option>
            {groupes.map((g, idx) => <option key={String(g.id) + '-' + idx} value={g.id}>{g.nom}</option>)}
          </select>
        </div>
        {etudiantsGroupe.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <label>Étudiants (sélection multiple possible) :</label><br />
            {etudiantsGroupe.map((e, idx) => (
              <label key={String(e.id) + '-' + idx} style={{ marginRight: 10 }}>
                <input type="checkbox" value={e.id} checked={selectedEtudiants.includes(String(e.id))} onChange={handleSelectEtudiant} />
                {e.nom} ({e.email})
              </label>
            ))}
          </div>
        )}
        {mode === "fusion" && selectedEtudiants.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <label>Étudiant de référence (dont on garde le projet) : </label>
            <select value={referenceEtudiant} onChange={e => setReferenceEtudiant(e.target.value)} required>
              <option value="">Sélectionner un étudiant</option>
              {selectedEtudiants.map(id => {
                const etu = etudiantsGroupe.find(e => String(e.id) === String(id));
                return etu ? <option key={id} value={id}>{etu.nom} ({etu.email})</option> : null;
              })}
            </select>
          </div>
        )}
        {mode === "nouveau" && (
          <div style={{ marginTop: 10 }}>
            <input name="titre" placeholder="Titre" value={formProjet.titre} onChange={handleChangeProjet} required />
            <input name="description" placeholder="Description" value={formProjet.description} onChange={handleChangeProjet} required />
            <input name="technologies" placeholder="Technologies" value={formProjet.technologies} onChange={handleChangeProjet} required />
            <input name="dateDebut" type="date" value={formProjet.dateDebut} onChange={handleChangeProjet} required />
            <input name="dateFin" type="date" value={formProjet.dateFin} onChange={handleChangeProjet} required />
            <input name="organisme" placeholder="Organisme" value={formProjet.organisme} onChange={handleChangeProjet} />
          </div>
        )}
        <button type="submit" style={{ marginTop: 10 }}>Créer projet partagé</button>
      </form>

      <h3>Ajouter un compte-rendu</h3>
      <form onSubmit={handleAddCompteRendu}>
        <select onChange={e => setCompteRendu({ ...compteRendu, projetId: e.target.value })} value={compteRendu.projetId}>
          <option value="">Sélectionner un projet</option>
          {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
        </select>
        <textarea onChange={e => setCompteRendu({ ...compteRendu, contenu: e.target.value })} value={compteRendu.contenu} placeholder="Contenu du compte-rendu" required />
        <button type="submit">Ajouter</button>
      </form>

      <h3 style={{ marginTop: 20 }}>Mettre à jour le statut d'un projet</h3>
      <form onSubmit={handleChangeStatut}>
        <select onChange={e => setStatut({ ...statut, projetId: e.target.value })} value={statut.projetId}>
          <option value="">Sélectionner un projet</option>
          {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
        </select>
        <select onChange={e => setStatut({ ...statut, statut: e.target.value })} value={statut.statut}>
          <option value="EN_COURS">En cours</option>
          <option value="TERMINE">Terminé</option>
        </select>
        <button type="submit">Mettre à jour</button>
      </form>

      <h3 style={{ marginTop: 20 }}>Liste des projets</h3>
      <ul>
        {Array.isArray(projets) && projets.map((p, idx) => (
          <li key={String(p.id) + '-' + idx}>
            <b>{p.titre}</b> - Étudiants : {p.etudiants ? p.etudiants.map(e => e.nom).join(", ") : "-"} | Statut : {p.statut}
          </li>
        ))}
      </ul>
      {!Array.isArray(projets) || projets.length === 0 ? <p>Aucun projet trouvé.</p> : null}
    </div>
  );
}

export default ProjetEncadrePage; 