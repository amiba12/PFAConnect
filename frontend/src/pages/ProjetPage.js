import React, { useEffect, useState } from "react";
import api from "../api/axios";
console.log("📍 Tu es dans ProjetPage");

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
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return <div>Chargement...</div>;

  if (user.role === "ETUDIANT") {
    return (
      <div>
        <h2>Mon projet</h2>
        {projet ? (
          <div>
            <p><b>Titre :</b> {projet.titre}</p>
            <p><b>Description :</b> {projet.description}</p>
            <p><b>Technologies :</b> {projet.technologies}</p>
            <p><b>Dates :</b> {projet.dateDebut} - {projet.dateFin}</p>
            <p><b>Organisme :</b> {projet.organisme}</p>
            <button onClick={handleEdit}>Modifier</button>
            <button onClick={handleDelete} style={{marginLeft:10, backgroundColor:'red', color:'white'}}>Supprimer</button>
            {editMode && (
              <form onSubmit={handleUpdate} style={{marginTop:20}}>
                <input name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <input name="technologies" placeholder="Technologies" value={form.technologies} onChange={handleChange} required />
                <input name="dateDebut" type="date" value={form.dateDebut} onChange={handleChange} required />
                <input name="dateFin" type="date" value={form.dateFin} onChange={handleChange} required />
                <input name="organisme" placeholder="Organisme" value={form.organisme} onChange={handleChange} />
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={()=>setEditMode(false)} style={{marginLeft:10}}>Annuler</button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreate}>
            <input name="titre" placeholder="Titre" onChange={handleChange} required />
            <input name="description" placeholder="Description" onChange={handleChange} required />
            <input name="technologies" placeholder="Technologies" onChange={handleChange} required />
            <input name="dateDebut" type="date" onChange={handleChange} required />
            <input name="dateFin" type="date" onChange={handleChange} required />
            <input name="organisme" placeholder="Organisme" onChange={handleChange} />
            <button type="submit">Créer mon projet</button>
          </form>
        )}
        {message && <p>{message}</p>}
      </div>
    );
  }

  if (user.role === "ENCADRANT" || user.role === "ADMIN") {
    return (
      <div>
        <h2>Liste des projets</h2>
        <ul>
          {projetsEncadres.map((p) => (
            <li key={p.id}>
              <b>{p.titre}</b> - {p.etudiant && p.etudiant.nom} ({p.statut})
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

export default ProjetPage; 