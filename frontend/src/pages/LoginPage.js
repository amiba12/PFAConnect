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
        // Force le rechargement du dashboard après connexion
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
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Pas de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}

export default LoginPage; 