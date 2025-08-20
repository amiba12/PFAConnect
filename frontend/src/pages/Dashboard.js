import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = getEmailFromToken();
    if (!email) {
      setError("Token invalide ou expiré. Veuillez vous reconnecter.");
      return;
    }
    api.get("/users/" + email)
      .then((res) => {
        setUser(res.data);
        console.log("User loaded:", res.data);
      })
      .catch((err) => {
        setError("Erreur lors du chargement de l'utilisateur");
        console.error("Erreur lors du chargement de l'utilisateur", err);
      });
  }, []);

  function getEmailFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (e) {
      return "";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div>Chargement...</div>;

  if (user.role === "ETUDIANT") {
    return (
      <div>
        <h2>Dashboard Étudiant</h2>
        <button onClick={() => navigate("/projet")}>Mon projet</button>
        <button onClick={() => navigate("/rapports")}>Mes rapports</button>
        <button onClick={() => navigate("/messages")}>Messagerie</button>
        <button onClick={() => navigate("/compterendus")}>Comptes-rendus de séance</button>
        <button onClick={handleLogout} style={{ marginTop: 20, backgroundColor: 'red', color: 'white' }}>Déconnexion</button>
      </div>
    );
  }
  if (user.role === "ENCADRANT") {
    return (
      <div>
        <h2>Dashboard Encadrant</h2>
        <button onClick={() => navigate("/projets-encadres")}>Projets encadrés</button>
        <button onClick={() => navigate("/messages")}>Messagerie</button>
        <button onClick={() => navigate("/compterendus")}>Comptes-rendus de séance</button>
        <button onClick={handleLogout} style={{ marginTop: 20, backgroundColor: 'red', color: 'white' }}>Déconnexion</button>
      </div>
    );
  }
  if (user.role === "ADMIN") {
    return (
      <div>
        <h2>Dashboard Administrateur</h2>
        <button onClick={() => navigate("/groupes")}>Gestion des groupes</button>
        <button onClick={() => navigate("/projet")}>Tous les projets</button>
        <button onClick={() => navigate("/admin-users")}>Valider les comptes</button>
        <button onClick={() => navigate("/etudiants")}>Liste des étudiants</button>
        <button onClick={() => navigate("/utilisateurs")}>Gestion des utilisateurs</button>
        <button onClick={() => navigate("/groupes-assignation")}>Gérer les groupes (assignation)</button>
        <button onClick={() => navigate("/supervision-projets")}>Superviser les projets</button>
        <button onClick={handleLogout} style={{ marginTop: 20, backgroundColor: 'red', color: 'white' }}>Déconnexion</button>
      </div>
    );
  }
  return null;
}

export default Dashboard; 