import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("/users/en-attente").then((res) => setUsers(res.data));
  };

  const handleActivate = async (id) => {
    await api.put(`/users/activer/${id}`);
    setMessage("Utilisateur activé");
    fetchUsers();
  };

  return (
    <div>
      <h2>Comptes en attente de validation</h2>
      {message && <p>{message}</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <b>{u.nom}</b> ({u.email}) - {u.role}
            <button onClick={() => handleActivate(u.id)} style={{ marginLeft: 10 }}>
              Activer
            </button>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>Aucun compte en attente.</p>}
    </div>
  );
}

export default AdminUsersPage; 