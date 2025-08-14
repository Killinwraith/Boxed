// import { useState } from "react";
import "./App.css";
import { useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import LogIn from "@/pages/Login";
import { AuthContext } from "./../AuthContext/authContext";

function App() {
  const { isSignedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("isSignedIn:", isSignedIn);

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isSignedIn]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Login/:loginAction" element={<LogIn />} />
      </Routes>
    </>
  );
}

export default App;
