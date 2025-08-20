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
    setForm({ ...user, password: "" });
  };

  return (
    <div className="row">
      <div className="col-lg-5">
        <div className="card shadow-sm mb-3 animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h6 mb-3">{isEditing ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h2>
            <form onSubmit={isEditing ? handleUpdate : handleCreate} className="row g-2">
              <div className="col-md-6"><input className="form-control" name="nom" value={form.nom} placeholder="Nom" onChange={handleChange} required /></div>
              <div className="col-md-6"><input className="form-control" name="email" value={form.email} type="email" placeholder="Email" onChange={handleChange} required /></div>
              <div className="col-md-6"><input className="form-control" name="password" value={form.password} type="password" placeholder="Mot de passe" onChange={handleChange} /></div>
              <div className="col-md-6"><input className="form-control" name="telephone" value={form.telephone} placeholder="Téléphone" onChange={handleChange} /></div>
              <div className="col-md-6">
                <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="ENCADRANT">Encadrant</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="col-12"><button type="submit" className="btn btn-primary">{isEditing ? "Modifier" : "Ajouter"}</button></div>
            </form>
            {message && <p className="alert alert-info py-2 mt-2">{message}</p>}
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h6 mb-3">Utilisateurs</h2>
            <ul className="list-group">
              {users.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <b>{u.nom}</b> ({u.email}) - {u.role}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => startEdit(u)}>Modifier</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
              {users.length === 0 && <li className="list-group-item text-muted">Aucun utilisateur trouvé.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilisateursPage; 