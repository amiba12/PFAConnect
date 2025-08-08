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
        api.get(`/rapports/projet/${res.data.id}`).then((r) => {
          console.log("📋 Rapports chargés:", r.data);
          setRapports(r.data);
        });
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
      console.log("📤 Upload du fichier:", file.name);
      await api.post(`/rapports/upload/${projet.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Rapport déposé");
      api.get(`/rapports/projet/${projet.id}`).then((r) => setRapports(r.data));
    } catch (err) {
      console.error("❌ Erreur upload:", err);
      setMessage("Erreur lors du dépôt du rapport");
    }
  };

  const handlePdfClick = (rapportId) => {
    console.log("🔗 Clic sur PDF pour rapport ID:", rapportId);
    const url = `/api/rapports/file/${rapportId}`;
    console.log("🌐 URL:", url);
    window.open(url, '_blank');
  };

  return (
    <div>
      <h2>Mes rapports</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
        <input
          type="url"
          placeholder="Lien GitHub"
          value={lienGitHub}
          onChange={(e) => setLienGitHub(e.target.value)}
        />
        <button type="submit">Déposer</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {rapports.map((r) => (
          <li key={r.id}>
            <button onClick={() => handlePdfClick(r.id)}>PDF</button> |
            <a href={r.lienGitHub} target="_blank" rel="noopener noreferrer">GitHub</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RapportPage; 