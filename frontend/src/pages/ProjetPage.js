import React, { useEffect, useState } from "react";
import api from "../api/axios";

function ProjetPage() {
  const [projet, setProjet] = useState(null);
  const [projetsEncadres, setProjetsEncadres] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ titre: "", description: "", technologies: "", dateDebut: "", dateFin: "", organisme: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Utiliser /users/me pour obtenir l'utilisateur actuel
      const userResponse = await api.get("/users/me");
      const currentUser = userResponse.data;
      setUser(currentUser);
      
      // Charger les données en fonction du rôle
      if (currentUser.role === "ETUDIANT") {
        try {
          const projetResponse = await api.get("/projets/mon-projet");
          setProjet(projetResponse.data);
        } catch (err) {
          console.error("Erreur chargement projet étudiant", err);
          setProjet(null);
        }
      } else if (currentUser.role === "ENCADRANT") {
        try {
          const projetsResponse = await api.get("/projets/encadrant/mes-projets");
          setProjetsEncadres(Array.isArray(projetsResponse.data) ? projetsResponse.data : []);
        } catch (err) {
          console.error("Erreur chargement projets encadrant", err);
          setProjetsEncadres([]);
        }
      } else if (currentUser.role === "ADMIN") {
        try {
          const projetsResponse = await api.get("/projets/");
          setProjetsEncadres(Array.isArray(projetsResponse.data) ? projetsResponse.data : []);
        } catch (err) {
          console.error("Erreur chargement projets admin", err);
          setProjetsEncadres([]);
        }
      }
    } catch (err) {
      console.error("Erreur chargement utilisateur", err);
      setError("Impossible de charger vos informations. Veuillez vous reconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const res = await api.post("/projets/creer", form);
      setMessage(res.data);
      
      // Recharger le projet après création
      if (user && user.role === "ETUDIANT") {
        try {
          const projetResponse = await api.get("/projets/mon-projet");
          setProjet(projetResponse.data);
        } catch (err) {
          console.error("Erreur rechargement projet après création", err);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la création du projet", err);
      setMessage("Erreur lors de la création du projet");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre projet ?")) return;
    try {
      setMessage("");
      await api.delete("/projets/mon-projet");
      setProjet(null);
      setMessage("Projet supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression du projet", err);
      setMessage("Erreur lors de la suppression du projet");
    }
  };

  const [editMode, setEditMode] = useState(false);
  const handleEdit = () => {
    setForm({
      titre: projet.titre || "",
      description: projet.description || "",
      technologies: projet.technologies || "",
      dateDebut: projet.dateDebut ? projet.dateDebut.substring(0, 10) : "",
      dateFin: projet.dateFin ? projet.dateFin.substring(0, 10) : "",
      organisme: projet.organisme || ""
    });
    setEditMode(true);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await api.put("/projets/modifier", form);
      setMessage("Projet modifié avec succès");
      
      // Recharger le projet après modification
      if (user && user.role === "ETUDIANT") {
        try {
          const projetResponse = await api.get("/projets/mon-projet");
          setProjet(projetResponse.data);
          setEditMode(false);
        } catch (err) {
          console.error("Erreur rechargement projet après modification", err);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la modification du projet", err);
      setMessage("Erreur lors de la modification du projet");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Chargement...</div>;

  if (user.role === "ETUDIANT") {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
          <div className="card shadow-sm animate__animated animate__fadeIn">
            <div className="card-body">
              <h2 className="h5 mb-3">Mon projet</h2>
              {projet ? (
                <div>
                  <p><b>Titre :</b> {projet.titre}</p>
                  <p><b>Description :</b> {projet.description}</p>
                  <p><b>Technologies :</b> {projet.technologies}</p>
                  <p><b>Dates :</b> {projet.dateDebut} - {projet.dateFin}</p>
                  <p><b>Organisme :</b> {projet.organisme}</p>
                  <button className="btn btn-primary me-2" onClick={handleEdit}>Modifier</button>
                  <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
                  {editMode && (
                    <form onSubmit={handleUpdate} className="row g-2 mt-3">
                      <div className="col-md-4"><input className="form-control" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required /></div>
                      <div className="col-md-8"><input className="form-control" name="description" placeholder="Description" value={form.description} onChange={handleChange} required /></div>
                      <div className="col-md-6"><input className="form-control" name="technologies" placeholder="Technologies" value={form.technologies} onChange={handleChange} required /></div>
                      <div className="col-md-3"><input className="form-control" name="dateDebut" type="date" value={form.dateDebut} onChange={handleChange} required /></div>
                      <div className="col-md-3"><input className="form-control" name="dateFin" type="date" value={form.dateFin} onChange={handleChange} required /></div>
                      <div className="col-md-6"><input className="form-control" name="organisme" placeholder="Organisme" value={form.organisme} onChange={handleChange} /></div>
                      <div className="col-12"><button type="submit" className="btn btn-success">Enregistrer</button> <button type="button" className="btn btn-outline-secondary ms-2" onClick={()=>setEditMode(false)}>Annuler</button></div>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreate} className="row g-2">
                  <div className="col-md-4"><input className="form-control" name="titre" placeholder="Titre" onChange={handleChange} required /></div>
                  <div className="col-md-8"><input className="form-control" name="description" placeholder="Description" onChange={handleChange} required /></div>
                  <div className="col-md-6"><input className="form-control" name="technologies" placeholder="Technologies" onChange={handleChange} required /></div>
                  <div className="col-md-3"><input className="form-control" name="dateDebut" type="date" onChange={handleChange} required /></div>
                  <div className="col-md-3"><input className="form-control" name="dateFin" type="date" onChange={handleChange} required /></div>
                  <div className="col-md-6"><input className="form-control" name="organisme" placeholder="Organisme" onChange={handleChange} /></div>
                  <div className="col-12"><button type="submit" className="btn btn-primary">Créer mon projet</button></div>
                </form>
              )}
              {message && <p className="mt-2 alert alert-info py-2">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "ENCADRANT" || user.role === "ADMIN") {
    return (
      <div>
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h5 mb-3">Liste des projets</h2>
            <ul className="list-group">
              {projetsEncadres.map((p) => (
                <li key={p.id} className="list-group-item">
                  <b>{p.titre}</b> - {p.etudiant && p.etudiant.nom} ({p.statut})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default ProjetPage; 