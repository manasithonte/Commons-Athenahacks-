import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/home">
          <img src="img/logo-2.png" alt="Commons Logo" className="nav-logo" />
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/friends" className="nav-link">MY COMMONS</Link>
        <Link to="/profile" className="nav-link">PROFILE</Link>
      </div>
    </nav>
  );
};

export default Navbar;
