import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProjetPage from "./pages/ProjetPage";
import GroupePage from "./pages/GroupePage";
import RapportPage from "./pages/RapportPage";
import MessagesPage from "./pages/MessagesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import CompteRendusPage from "./pages/CompteRendusPage";
import EtudiantsPage from "./pages/EtudiantsPage";
import UtilisateursPage from "./pages/UtilisateursPage";
import GroupesAssignationPage from "./pages/GroupesAssignationPage";
import SupervisionProjetsPage from "./pages/SupervisionProjetsPage";
import ProjetEncadrePage from "./pages/ProjetEncadrePage";
import MessagesEncadrantPage from "./pages/MessagesEncadrantPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Router>
      <nav className="navbar navbar-expand-lg glass shadow-sm mt-2 mb-3 rounded-3 container">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold brand-gradient">PFAConnect</span>
        </div>
      </nav>
      <div className="container py-4 animate__animated animate__fadeIn">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-users" element={isAuthenticated ? <AdminUsersPage /> : <Navigate to="/login" />} />
          <Route path="/compterendus" element={isAuthenticated ? <CompteRendusPage /> : <Navigate to="/login" />} />
          <Route path="/etudiants" element={isAuthenticated ? <EtudiantsPage /> : <Navigate to="/login" />} />
          <Route path="/utilisateurs" element={isAuthenticated ? <UtilisateursPage /> : <Navigate to="/login" />} />
          <Route path="/groupes-assignation" element={isAuthenticated ? <GroupesAssignationPage /> : <Navigate to="/login" />} />
          <Route path="/supervision-projets" element={isAuthenticated ? <SupervisionProjetsPage /> : <Navigate to="/login" />} />
          <Route path="/projets-encadres" element={isAuthenticated ? <ProjetEncadrePage /> : <Navigate to="/login" />} />
          <Route path="/messages-encadrant" element={isAuthenticated ? <MessagesEncadrantPage /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projet" element={isAuthenticated ? <ProjetPage /> : <Navigate to="/login" />} />
          <Route path="/groupes" element={isAuthenticated ? <GroupePage /> : <Navigate to="/login" />} />
          <Route path="/rapports" element={isAuthenticated ? <RapportPage /> : <Navigate to="/login" />} />
          <Route path="/messages" element={isAuthenticated ? <MessagesPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 