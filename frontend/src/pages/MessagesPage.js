import React, { useEffect, useState } from "react";
import api from "../api/axios";

function MessagesPage() {
  const [user, setUser] = useState(null);
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Charger l'utilisateur
      const userResponse = await api.get("/users/me");
      const currentUser = userResponse.data;
      setUser(currentUser);
      
      if (currentUser.role === "ETUDIANT") {
        // Pour les étudiants : charger leur projet unique
        try {
          const projetResponse = await api.get("/projets/mon-projet");
          const projetData = projetResponse.data;
          if (projetData && projetData.id) {
            setSelectedProjet(projetData);
            await loadMessagesForProjet(projetData.id);
          } else {
            setError("Vous n'avez pas de projet. Créez un projet pour utiliser la messagerie.");
          }
        } catch (err) {
          console.error("Erreur chargement projet étudiant", err);
          setError("Erreur lors du chargement de votre projet.");
        }
      } else if (currentUser.role === "ENCADRANT") {
        // Pour les encadrants : charger tous leurs projets
        try {
          const projetsResponse = await api.get("/projets/encadrant/mes-projets");
          const projetsData = Array.isArray(projetsResponse.data) ? projetsResponse.data : [];
          setProjets(projetsData);
          console.log("📋 Projets encadrés chargés:", projetsData.length);
          
          if (projetsData.length > 0) {
            setSelectedProjet(projetsData[0]);
            await loadMessagesForProjet(projetsData[0].id);
          } else {
            setError("Vous n'encadrez aucun projet pour le moment.");
          }
        } catch (err) {
          console.error("Erreur chargement projets encadrant", err);
          setError("Erreur lors du chargement des projets encadrés.");
        }
      }
    } catch (err) {
      console.error("Erreur chargement utilisateur", err);
      setError("Impossible de charger vos informations. Veuillez vous reconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessagesForProjet = async (projetId) => {
    try {
      console.log("📨 Chargement des messages pour le projet:", projetId);
      const messagesResponse = await api.get(`/messages/projet/${projetId}`);
      const messagesData = Array.isArray(messagesResponse.data) ? messagesResponse.data : [];
      console.log("📨 Messages reçus:", messagesData.length);
      setMessages(messagesData);
    } catch (err) {
      console.error("Erreur chargement messages", err);
      setMessages([]);
    }
  };

  const handleProjetChange = async (projetId) => {
    const projet = projets.find(p => p.id == projetId);
    if (projet) {
      setSelectedProjet(projet);
      await loadMessagesForProjet(projet.id);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!contenu || !selectedProjet) return;
    
    console.log("🚀 Envoi du message pour le projet:", selectedProjet.id);
    console.log("📝 Contenu du message:", contenu);
    
    try {
      console.log("📤 Envoi du message à l'API...");
      await api.post(`/messages/ajouter/${selectedProjet.id}`, { contenu });
      console.log("✅ Message envoyé avec succès");
      setContenu("");
      
      console.log("🔄 Rechargement des messages...");
      await loadMessagesForProjet(selectedProjet.id);
      console.log("✅ Message envoyé et messages mis à jour avec succès");
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi du message:", err);
      console.error("❌ Détails de l'erreur:", err.response?.data);
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!selectedProjet) {
    return <div className="alert alert-warning">Aucun projet sélectionné.</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 m-0">Messagerie du projet</h2>
              {user && user.role === "ENCADRANT" && projets.length > 0 && (
                <div className="d-flex align-items-center">
                  <label className="me-2">Projet</label>
                  <select 
                    className="form-select"
                    style={{ width: 280 }}
                    value={selectedProjet.id} 
                    onChange={(e) => handleProjetChange(e.target.value)}
                  >
                    {projets.map((projet) => (
                      <option key={projet.id} value={projet.id}>
                        {projet.titre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage; 