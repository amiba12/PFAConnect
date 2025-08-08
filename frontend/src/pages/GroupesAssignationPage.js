import React, { useEffect, useState } from "react";
import api from "../api/axios";

function GroupesAssignationPage() {
  const [groupes, setGroupes] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [encadrants, setEncadrants] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [selectedEtudiant, setSelectedEtudiant] = useState("");
  const [selectedEncadrant, setSelectedEncadrant] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/groupes/").then((res) => setGroupes(res.data));
    api.get("/users/").then((res) => {
      setEtudiants(res.data.filter(u => u.role === "ETUDIANT"));
      setEncadrants(res.data.filter(u => u.role === "ENCADRANT"));
    });
  }, []);

  const handleAddEtudiant = async () => {
    if (!selectedGroupe || !selectedEtudiant) return;
    await api.post(`/groupes/${selectedGroupe}/ajouter-etudiant/${selectedEtudiant}`);
    setMessage("Étudiant ajouté au groupe");
  };

  const handleAssignEncadrant = async () => {
    if (!selectedGroupe || !selectedEncadrant) return;
    await api.post(`/groupes/${selectedGroupe}/associer-encadrant/${selectedEncadrant}`);
    setMessage("Encadrant assigné au groupe");
  };

  return (
    <div>
      <h2>Gérer les groupes (assignation)</h2>
      <div>
        <h3>Ajouter un étudiant à un groupe</h3>
        <select onChange={e => setSelectedGroupe(e.target.value)} value={selectedGroupe}>
          <option value="">Sélectionner un groupe</option>
          {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
        </select>
        <select onChange={e => setSelectedEtudiant(e.target.value)} value={selectedEtudiant}>
          <option value="">Sélectionner un étudiant</option>
          {etudiants.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
        </select>
        <button onClick={handleAddEtudiant}>Ajouter</button>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>Assigner un encadrant à un groupe</h3>
        <select onChange={e => setSelectedGroupe(e.target.value)} value={selectedGroupe}>
          <option value="">Sélectionner un groupe</option>
          {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
        </select>
        <select onChange={e => setSelectedEncadrant(e.target.value)} value={selectedEncadrant}>
          <option value="">Sélectionner un encadrant</option>
          {encadrants.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
        </select>
        <button onClick={handleAssignEncadrant}>Assigner</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GroupesAssignationPage; 