import { useState } from "react";
import "./App.css";
import Game from "./components/Game";
import Stats from "./components/Stats/Stats";

function App() {
  return (
    <div className="game">
      <Game />
      <Stats />
    </div>
  );
}

export default App;

