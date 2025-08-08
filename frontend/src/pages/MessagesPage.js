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
    return <div style={{color:'red'}}>{error}</div>;
  }

  if (!selectedProjet) {
    return <div style={{color:'red'}}>Aucun projet sélectionné.</div>;
  }

  return (
    <div>
      <h2>Messagerie du projet</h2>
      
      {user && user.role === "ENCADRANT" && projets.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Projet : </label>
          <select 
            value={selectedProjet.id} 
            onChange={(e) => handleProjetChange(e.target.value)}
            style={{ marginLeft: 10, padding: 5 }}
          >
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.titre}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
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
    </div>
  );
}

export default MessagesPage; 