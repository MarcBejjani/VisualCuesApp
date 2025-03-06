import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './images/logepl.jpg';


const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <div className="center-text">
                Visual Cues
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/story">Story</Link>
                <Link to="/artsearch">Art Search</Link>
                <Link to="/about">About</Link>

                {/* Dropdown Menu for Account */}
                <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
                    <button onClick={toggleDropdown} className="dropbtn">
                        Account
                    </button>
                    <div className="dropdown-content">
                        <Link to="/signup" onClick={toggleDropdown}>Sign Up</Link>
                        <Link to="/login" onClick={toggleDropdown}>Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
