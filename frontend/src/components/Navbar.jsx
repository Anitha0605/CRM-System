import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token clear pannum
    // window.location.href use pannalam illa navigate use pannalam
    window.location.href = '/login'; 
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-logo">
        📊 <span>CRM Portal</span>
      </div>
      <div className="nav-actions">
        <span className="user-tag">Hi, User!</span>
        <button className="logout-btn-modern" onClick={handleLogout}>
          Logout 🚪
        </button>
      </div>
    </nav>
  );
};

export default Navbar;