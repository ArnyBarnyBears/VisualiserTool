import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1> OCR Algorithms </h1>
        <p> A website to help you learn algorithms.</p>
        <Link to="/pathfinding">
          <button> PATHFINDING </button>
        </Link>
        <Link to="/sorting">
          <button> SORTING </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;