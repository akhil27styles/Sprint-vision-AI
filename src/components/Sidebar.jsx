// components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-icon">◆</span>
        <span className="logo-text">Sprint Vision</span>
      </div>
      <nav>
        <ul>
          <li className="active"><span className="icon">☰</span> Board</li>
          <li><span className="icon">📊</span> Analytics</li>
          <li><span className="icon">≡</span> Backlog</li>
          <li><span className="icon">⚠</span> Server error</li>
          <li><span className="icon">404</span> Not found</li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;