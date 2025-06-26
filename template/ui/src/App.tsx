import Header from "./componentes/Header";
import Home from "./componentes/Home";
import Logs from "./componentes/Logs";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </div>
  );
}

export default App;
