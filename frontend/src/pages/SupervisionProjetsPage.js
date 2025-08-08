import React, { useEffect, useState } from "react";
import api from "../api/axios";

function SupervisionProjetsPage() {
  const [projets, setProjets] = useState([]);

  useEffect(() => {
    api.get("/projets/").then((res) => setProjets(res.data));
  }, []);

  return (
    <div>
      <h2>Supervision des projets</h2>
      <ul>
        {projets.map((p) => (
          <li key={p.id}>
            <b>{p.titre}</b>
            <br />
            - Étudiants : {p.etudiants ? p.etudiants.map(e => e.nom).join(", ") : "-"}
            <br />
            - Statut : {p.statut}
            <br />
            - Groupe : {p.groupe ? p.groupe.nom : "-"}
            <br />
            - Encadrant : {p.groupe && p.groupe.encadrant ? p.groupe.encadrant.nom : "-"}
          </li>
        ))}
      </ul>
      {projets.length === 0 && <p>Aucun projet trouvé.</p>}
    </div>
  );
}

export default SupervisionProjetsPage; 