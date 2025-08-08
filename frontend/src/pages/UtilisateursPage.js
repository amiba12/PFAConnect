import React, { useEffect, useState } from "react";
import api from "../api/axios";

function UtilisateursPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "ETUDIANT",
    enabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("/users/").then((res) => setUsers(res.data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/users/", form);
    setMessage("Utilisateur créé");
    fetchUsers();
    setForm({ nom: "", email: "", password: "", telephone: "", role: "ETUDIANT", enabled: true });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/users/${currentId}`, form);
    setMessage("Utilisateur modifié");
    fetchUsers();
    setIsEditing(false);
    setCurrentId(null);
    setForm({ nom: "", email: "", password: "", telephone: "", role: "ETUDIANT", enabled: true });
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    setMessage("Utilisateur supprimé");
    fetchUsers();
  };

  const startEdit = (user) => {
    setIsEditing(true);
    setCurrentId(user.id);
    setForm({ ...user, password: "" }); // Ne pas afficher le hash du mot de passe
  };

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <h3>{isEditing ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h3>
        <input name="nom" value={form.nom} placeholder="Nom" onChange={handleChange} required />
        <input name="email" value={form.email} type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" value={form.password} type="password" placeholder="Mot de passe (laisser vide si pas de changement)" onChange={handleChange} />
        <input name="telephone" value={form.telephone} placeholder="Téléphone" onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="ETUDIANT">Étudiant</option>
          <option value="ENCADRANT">Encadrant</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">{isEditing ? "Modifier" : "Ajouter"}</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <b>{u.nom}</b> ({u.email}) - {u.role}
            <button onClick={() => startEdit(u)} style={{ marginLeft: 10 }}>Modifier</button>
            <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 10, color: 'red' }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>Aucun utilisateur trouvé.</p>}
    </div>
  );
}

export default UtilisateursPage; 