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
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h5">Messagerie (Encadrant)</h2>
            <div className="d-flex align-items-center gap-2 mb-3">
              <select className="form-select" onChange={e => setSelectedProjet(e.target.value)} value={selectedProjet} style={{ maxWidth: 360 }}>
                <option value="">Sélectionner un projet pour voir les messages</option>
                {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
              </select>
            </div>

            {selectedProjet && (
              <>
                <div className="border rounded p-3 mb-3" style={{ maxHeight: 320, overflowY: "auto" }}>
                  {messages.map((m) => (
                    <div key={m.id} className="mb-2">
                      <b>{m.auteur && m.auteur.nom} :</b> {m.contenu} <span className="text-muted" style={{ fontSize: 12 }}>{new Date(m.date).toLocaleString()}</span>
                    </div>
                  ))}
                  {messages.length === 0 && <div className="text-muted">Aucun message pour le moment.</div>}
                </div>
                <form onSubmit={handleSend} className="d-flex gap-2">
                  <input
                    className="form-control"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    placeholder="Votre message"
                    required
                  />
                  <button type="submit" className="btn btn-primary">Envoyer</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesEncadrantPage; 