import { useState } from "react";
import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "@/pages/Layout";
import Landing from "@/pages/Landing";
// import Dashboard from "@/pages/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <div>
        Hello World
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      </div> */}
      <Landing />
    </>
  );
}

export default App;
