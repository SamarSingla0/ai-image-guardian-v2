import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaRobot } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <FaRobot /> AI Guardian
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Upload</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={logoutUser} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link" style={{color: 'var(--primary-color)'}}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;