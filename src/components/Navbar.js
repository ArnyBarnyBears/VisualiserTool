import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

function Navbar() {
  return (
    <div className="navbar">
      <div className="leftSide">
        <Link to="/"> Home </Link>
        <Link to="/pathfinding"> Pathfinding </Link>
        <Link to="/sorting"> Sorting </Link>
      </div>
      <div className="rightSide">
      </div>
    </div>
  );
}

export default Navbar;