import React, { useEffect, useState } from "react";
import api from "../api/axios";

function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState([]);

  useEffect(() => {
    api.get("/users/").then((res) => {
      setEtudiants(res.data.filter(u => u.role === "ETUDIANT"));
    });
  }, []);

  return (
    <div className="card shadow-sm animate__animated animate__fadeIn">
      <div className="card-body">
        <h2 className="h5 mb-3">Liste des étudiants</h2>
        <ul className="list-group">
          {etudiants.map((e) => (
            <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{e.nom} ({e.email})</div>
              <span className="text-muted" style={{ fontSize: 13 }}>{e.telephone}</span>
            </li>
          ))}
          {etudiants.length === 0 && <li className="list-group-item text-muted">Aucun étudiant trouvé.</li>}
        </ul>
      </div>
    </div>
  );
}

export default EtudiantsPage; 