import React, { useEffect, useState } from "react";
import api from "../api/axios";

function SupervisionProjetsPage() {
  const [projets, setProjets] = useState([]);

  useEffect(() => {
    api.get("/projets/").then((res) => setProjets(res.data));
  }, []);

  return (
    <div className="card shadow-sm animate__animated animate__fadeIn">
      <div className="card-body">
        <h2 className="h5 mb-3">Supervision des projets</h2>
        <ul className="list-group">
          {projets.map((p) => (
            <li key={p.id} className="list-group-item">
              <b>{p.titre}</b>
              <div className="text-muted" style={{ fontSize: 14 }}>
                Étudiants : {p.etudiants ? p.etudiants.map(e => e.nom).join(", ") : "-"} • Statut : {p.statut} • Groupe : {p.groupe ? p.groupe.nom : "-"} • Encadrant : {p.groupe && p.groupe.encadrant ? p.groupe.encadrant.nom : "-"}
              </div>
            </li>
          ))}
        </ul>
        {projets.length === 0 && <p className="text-muted mt-2">Aucun projet trouvé.</p>}
      </div>
    </div>
  );
}

export default SupervisionProjetsPage; 