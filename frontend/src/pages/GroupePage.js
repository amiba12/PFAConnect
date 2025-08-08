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
    <div>
      <h2>Gestion des groupes</h2>
      <form onSubmit={handleCreate}>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du groupe"
          required
        />
        <button type="submit">Créer</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {groupes.map((g) => (
          <li key={g.id}>
            <b>{g.nom}</b> - {g.etudiants && g.etudiants.length} étudiants
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupePage; 