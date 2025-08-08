import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "ETUDIANT",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMessage("Inscription réussie ! Votre compte sera activé par un administrateur.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Erreur lors de l'inscription");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input name="nom" placeholder="Nom" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
        <input name="telephone" placeholder="Téléphone" onChange={handleChange} />
        <select name="role" onChange={handleChange} required>
          <option value="ETUDIANT">Étudiant</option>
          <option value="ENCADRANT">Encadrant</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage; 