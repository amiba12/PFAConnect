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

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Chargement...</div>;

  const Welcome = ({ name, tagline, actions }) => (
    <div className="card shadow-sm animate__animated animate__fadeIn">
      <div className="card-body">
        <h2 className="h4 mb-1">Bienvenue, {name}</h2>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>{tagline}</div>
        <div className="row g-3">
          {actions.map((a, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-3">
              <div
                role="button"
                className={`card h-100 border-0 shadow-sm animate__animated animate__fadeInUp`}
                onClick={a.onClick}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <span className={`badge text-bg-${a.variant} mb-2`} style={{ alignSelf: 'center' }}>{a.badge || '●'}</span>
                  <div className="fw-medium" style={{ lineHeight: 1.2 }}>{a.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button className="btn btn-danger" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    </div>
  );

  const slogans = {
    ETUDIANT: "Avance pas à pas, ton PFA prend forme.",
    ENCADRANT: "Guide et inspire tes projets encadrés.",
    ADMIN: "Organise, supervise et facilite la réussite.",
  };

  if (user.role === "ETUDIANT") {
    const actions = [
      { label: "Mon projet", variant: "primary", onClick: () => navigate("/projet") },
      { label: "Mes rapports", variant: "secondary", onClick: () => navigate("/rapports") },
      { label: "Messagerie", variant: "success", onClick: () => navigate("/messages") },
      { label: "Comptes-rendus", variant: "warning", onClick: () => navigate("/compterendus") },
    ];
    return <Welcome name={user.nom} tagline={slogans.ETUDIANT} actions={actions} />;
  }

  if (user.role === "ENCADRANT") {
    const actions = [
      { label: "Projets encadrés", variant: "primary", onClick: () => navigate("/projets-encadres") },
      { label: "Messagerie", variant: "success", onClick: () => navigate("/messages") },
      { label: "Comptes-rendus", variant: "warning", onClick: () => navigate("/compterendus") },
    ];
    return <Welcome name={user.nom} tagline={slogans.ENCADRANT} actions={actions} />;
  }

  if (user.role === "ADMIN") {
    const actions = [
      { label: "Gestion des groupes", variant: "primary", onClick: () => navigate("/groupes") },
      { label: "Tous les projets", variant: "secondary", onClick: () => navigate("/projet") },
      { label: "Valider les comptes", variant: "info", onClick: () => navigate("/admin-users") },
      { label: "Liste des étudiants", variant: "dark", onClick: () => navigate("/etudiants") },
      { label: "Gestion des utilisateurs", variant: "primary", onClick: () => navigate("/utilisateurs") },
      { label: "Assignation groupes", variant: "warning", onClick: () => navigate("/groupes-assignation") },
      { label: "Superviser les projets", variant: "success", onClick: () => navigate("/supervision-projets") },
    ];
    return <Welcome name={user.nom} tagline={slogans.ADMIN} actions={actions} />;
  }

  return null;
}

export default Dashboard; 