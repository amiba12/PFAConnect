import React, { useEffect, useState } from "react";
import api from "../api/axios";

function MessagesEncadrantPage() {
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState("");
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    api.get("/projets/encadrant/mes-projets").then((res) => setProjets(res.data));
  }, []);

  useEffect(() => {
    if (selectedProjet) {
      api.get(`/messages/projet/${selectedProjet}`).then((r) => setMessages(r.data));
    }
  }, [selectedProjet]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!contenu || !selectedProjet) return;
    try {
      await api.post(`/messages/ajouter/${selectedProjet}`, { contenu });
      setContenu("");
      api.get(`/messages/projet/${selectedProjet}`).then((r) => setMessages(r.data));
    } catch (err) {
      alert("Erreur lors de l'envoi du message");
    }
  };

  return (
    <div>
      <h2>Messagerie</h2>
      <select onChange={e => setSelectedProjet(e.target.value)} value={selectedProjet}>
        <option value="">Sélectionner un projet pour voir les messages</option>
        {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
      </select>

      {selectedProjet && (
        <>
          <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
            {messages.map((m) => (
              <div key={m.id}>
                <b>{m.auteur && m.auteur.nom} :</b> {m.contenu} <span style={{ fontSize: 10, color: '#888' }}>{new Date(m.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend}>
            <input
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Votre message"
              required
            />
            <button type="submit">Envoyer</button>
          </form>
        </>
      )}
    </div>
  );
}

export default MessagesEncadrantPage; 