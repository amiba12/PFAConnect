import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Réponse login:", res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setError("");
        window.location.href = "/";
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm animate__animated animate__fadeIn glass">
          <div className="card-body">
            <h2 className="h5 mb-3 text-center"><span className="brand-gradient">PFAConnect</span> - Connexion</h2>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleLogin} className="d-grid gap-2">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="form-control"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Se connecter</button>
            </form>
            <p className="mt-3 mb-0 text-center">Pas de compte ? <Link to="/register">Créer un compte</Link></p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-4 mt-md-0">
        <div className="card shadow-sm glass">
          <div className="card-body">
            <h3 className="h5 brand-gradient mb-2">Bienvenue sur PFAConnect</h3>
            <p className="mb-2">La plateforme qui vous accompagne tout au long de votre Projet de Fin d'Année.</p>
            <ul className="mb-3">
              <li>Organisez votre projet et partagez vos avancées</li>
              <li>Collaborez avec votre encadrant et votre équipe</li>
              <li>Déposez vos rapports et recevez des retours rapidement</li>
            </ul>
            <h4 className="h6">À propos de nous</h4>
            <p className="mb-0">Nous aidons les étudiants à réussir leur PFA grâce à une plateforme simple, moderne et efficace. Bon courage — chaque étape compte !</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 