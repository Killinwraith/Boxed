import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Auto redirect after login
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
