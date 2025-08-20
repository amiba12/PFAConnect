import React, { useEffect, useState } from "react";
import api from "../api/axios";

function GroupePage() {
  const [groupes, setGroupes] = useState([]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/groupes/").then((res) => setGroupes(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/groupes/", { nom });
      setMessage("Groupe créé");
      api.get("/groupes/").then((res) => setGroupes(res.data));
    } catch (err) {
      setMessage("Erreur lors de la création du groupe");
    }
  };

  return (
    <div className="card shadow-sm animate__animated animate__fadeIn">
      <div className="card-body">
        <h2 className="h5 mb-3">Gestion des groupes</h2>
        <form onSubmit={handleCreate} className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du groupe"
            required
          />
          <button type="submit" className="btn btn-primary">Créer</button>
        </form>
        {message && <p className="alert alert-info py-2">{message}</p>}
        <ul className="list-group">
          {groupes.map((g) => (
            <li key={g.id} className="list-group-item d-flex justify-content-between align-items-center">
              <b>{g.nom}</b>
              <span className="badge bg-secondary">{g.etudiants && g.etudiants.length} étudiants</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroupePage; 