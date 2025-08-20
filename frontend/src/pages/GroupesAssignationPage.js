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
    <div className="card shadow-sm animate__animated animate__fadeIn">
      <div className="card-body">
        <h2 className="h5 mb-3">Gérer les groupes (assignation)</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <h3 className="h6">Ajouter un étudiant à un groupe</h3>
            <div className="d-flex gap-2">
              <select className="form-select" onChange={e => setSelectedGroupe(e.target.value)} value={selectedGroupe}>
                <option value="">Sélectionner un groupe</option>
                {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
              </select>
              <select className="form-select" onChange={e => setSelectedEtudiant(e.target.value)} value={selectedEtudiant}>
                <option value="">Sélectionner un étudiant</option>
                {etudiants.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
              </select>
              <button className="btn btn-primary" onClick={handleAddEtudiant}>Ajouter</button>
            </div>
          </div>
          <div className="col-md-6">
            <h3 className="h6">Assigner un encadrant à un groupe</h3>
            <div className="d-flex gap-2">
              <select className="form-select" onChange={e => setSelectedGroupe(e.target.value)} value={selectedGroupe}>
                <option value="">Sélectionner un groupe</option>
                {groupes.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
              </select>
              <select className="form-select" onChange={e => setSelectedEncadrant(e.target.value)} value={selectedEncadrant}>
                <option value="">Sélectionner un encadrant</option>
                {encadrants.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
              </select>
              <button className="btn btn-success" onClick={handleAssignEncadrant}>Assigner</button>
            </div>
          </div>
        </div>
        {message && <p className="alert alert-info py-2 mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default GroupesAssignationPage; 