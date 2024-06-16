// components/Header.js
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="project-info">
        <img src="project-icon.png" alt="Project Icon" className="project-icon" />
        <div>
          <h1>JIRA Clone</h1>
          <p>Software project</p>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button">?</button>
        <button className="icon-button">GitHub</button>
        <button className="icon-button">🌙</button>
        <img src="avatar.png" alt="User Avatar" className="user-avatar" />
      </div>
    </header>
  );
}

export default Header;