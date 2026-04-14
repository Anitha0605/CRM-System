import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token clear panna
    navigate('/login'); // Login-ku poga
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo" onClick={() => navigate('/')}>
          📊 CRM System
        </h1>
        
        <div className="nav-links">
          <span className="user-welcome">Welcome, Tanika!</span>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;