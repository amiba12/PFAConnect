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
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h5 mb-3 text-center"><span style={{ color: '#e31b23' }}>PFAConnect</span> - Inscription</h2>
            {message && <div className="alert alert-info py-2">{message}</div>}
            <form onSubmit={handleRegister} className="row g-2">
              <div className="col-md-6"><input className="form-control" name="nom" placeholder="Nom" onChange={handleChange} required /></div>
              <div className="col-md-6"><input className="form-control" name="email" type="email" placeholder="Email" onChange={handleChange} required /></div>
              <div className="col-md-6"><input className="form-control" name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required /></div>
              <div className="col-md-6"><input className="form-control" name="telephone" placeholder="Téléphone" onChange={handleChange} /></div>
              <div className="col-md-6">
                <select className="form-select" name="role" onChange={handleChange} required>
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="ENCADRANT">Encadrant</option>
                </select>
              </div>
              <div className="col-12"><button type="submit" className="btn btn-primary w-100">S'inscrire</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 