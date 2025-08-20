import React, { useEffect, useState } from "react";
import api from "../api/axios";

function RapportPage() {
  const [projet, setProjet] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [file, setFile] = useState(null);
  const [lienGitHub, setLienGitHub] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/projets/mon-projet").then((res) => {
      setProjet(res.data);
      if (res.data && res.data.id) {
        api.get(`/rapports/projet/${res.data.id}`).then((r) => setRapports(r.data));
      }
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !projet) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lienGitHub", lienGitHub);
    try {
      await api.post(`/rapports/upload/${projet.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Rapport déposé");
      api.get(`/rapports/projet/${projet.id}`).then((r) => setRapports(r.data));
    } catch (err) {
      setMessage("Erreur lors du dépôt du rapport");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => window.history.back()}>← Retour</button>
        <div className="card shadow-sm animate__animated animate__fadeIn">
          <div className="card-body">
            <h2 className="h5 mb-3">Mes rapports</h2>
            <form onSubmit={handleUpload} className="row g-2 align-items-center">
              <div className="col-md-6">
                <input className="form-control" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="url"
                  placeholder="Lien GitHub"
                  value={lienGitHub}
                  onChange={(e) => setLienGitHub(e.target.value)}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Déposer</button>
              </div>
            </form>
            {message && <p className="mt-2 alert alert-info py-2">{message}</p>}

            <ul className="list-group mt-3">
              {rapports.map((r) => (
                <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-danger me-2">PDF</span>
                    <a href={`/api/rapports/file/${r.id}`} target="_blank" rel="noopener noreferrer">Ouvrir</a>
                  </div>
                  <a className="btn btn-outline-dark btn-sm" href={r.lienGitHub} target="_blank" rel="noopener noreferrer">GitHub</a>
                </li>
              ))}
              {rapports.length === 0 && <li className="list-group-item text-muted">Aucun rapport</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RapportPage; 