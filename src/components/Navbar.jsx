import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the navbar-specific CSS if needed
import logo from '../assets/Logo.png'; // Adjust the path to your logo

function Navbar() {
  return (
    <nav className="bottom-nav">
      <ul>
        <li>
          <img src={logo} alt="Logo" className="logo" />
        </li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/engagement">Engagement</Link></li>
        <li><Link to="/account">Account</Link></li>
        <li><Link to="/goals">Add a Goal</Link></li> {/* New link to the Goals view */}
      </ul>
    </nav>
  );
}

export default Navbar;
