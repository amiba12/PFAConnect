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

  const BackButton = () => (
    <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>
      ← Retour
    </button>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Chargement...</div>;

  const Button = ({ children, onClick, variant = "primary" }) => (
    <button className={`btn btn-${variant} me-2 mb-2`} onClick={onClick}>{children}</button>
  );

  const Wrapper = ({ title, children }) => (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{title}</h2>
        <div className="d-flex flex-wrap">{children}</div>
        <div className="mt-3">
          <Button variant="danger" onClick={handleLogout}>Déconnexion</Button>
        </div>
      </div>
    </div>
  );

  if (user.role === "ETUDIANT") {
    return (
      <Wrapper title="Dashboard Étudiant">
        <Button onClick={() => navigate("/projet")}>Mon projet</Button>
        <Button variant="secondary" onClick={() => navigate("/rapports")}>Mes rapports</Button>
        <Button variant="success" onClick={() => navigate("/messages")}>Messagerie</Button>
        <Button variant="warning" onClick={() => navigate("/compterendus")}>Comptes-rendus de séance</Button>
      </Wrapper>
    );
  }
  if (user.role === "ENCADRANT") {
    return (
      <Wrapper title="Dashboard Encadrant">
        <Button onClick={() => navigate("/projets-encadres")}>Projets encadrés</Button>
        <Button variant="success" onClick={() => navigate("/messages")}>Messagerie</Button>
        <Button variant="warning" onClick={() => navigate("/compterendus")}>Comptes-rendus de séance</Button>
      </Wrapper>
    );
  }
  if (user.role === "ADMIN") {
    return (
      <Wrapper title="Dashboard Administrateur">
        <Button onClick={() => navigate("/groupes")}>Gestion des groupes</Button>
        <Button variant="secondary" onClick={() => navigate("/projet")}>Tous les projets</Button>
        <Button variant="info" onClick={() => navigate("/admin-users")}>Valider les comptes</Button>
        <Button variant="dark" onClick={() => navigate("/etudiants")}>Liste des étudiants</Button>
        <Button variant="primary" onClick={() => navigate("/utilisateurs")}>Gestion des utilisateurs</Button>
        <Button variant="warning" onClick={() => navigate("/groupes-assignation")}>Gérer les groupes (assignation)</Button>
        <Button variant="success" onClick={() => navigate("/supervision-projets")}>Superviser les projets</Button>
      </Wrapper>
    );
  }
  return null;
}

export default Dashboard; 