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
    <div>
      <h2>Liste des étudiants</h2>
      <ul>
        {etudiants.map((e) => (
          <li key={e.id}>{e.nom} ({e.email}) - {e.telephone}</li>
        ))}
      </ul>
      {etudiants.length === 0 && <p>Aucun étudiant trouvé.</p>}
    </div>
  );
}

export default EtudiantsPage; 