// components/Header.js
import React from 'react';
import './Header.css';
// import img from "../../public/vite.svg"

function Header() {
  return (
    <header className="header">
      <div className="project-info">
        <img src="/vite.svg" alt="Project Icon" className="project-icon" />
        <div>
          <h1>Sprint Vision - AI</h1>
          <p>AI Fication of SDLC</p>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button">?</button>
        <button className="icon-button">GitHub</button>
        <button className="icon-button">🌙</button>
        <img src="/avtar.png" alt="User Avatar" className="user-avatar" />
      </div>
    </header>
  );
}

export default Header;