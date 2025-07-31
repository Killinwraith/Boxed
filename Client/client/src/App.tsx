// import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "@/pages/Layout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import LogIn from "@/pages/Login";

function App() {
  return (
    <>
      {/* <div>
        Hello World
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Login/:loginAction" element={<LogIn />} />
      </Routes>

      {/* <Landing /> */}
    </>
  );
}

export default App;
