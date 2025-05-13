import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './images/logepl.jpg';
import { useTheme } from './components/ThemeContext';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { toggleTheme } = useTheme();

    // Check if user is logged in from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token'); // Check if token exists
        if (token) {
            setIsLoggedIn(true); // Set user as logged in
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsLoggedIn(false); // Update the state to logged out
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
            </Link>
            <button id='theme-button' onClick={toggleTheme}>Toggle Theme</button>
            <div className="center-text">
                Visual Cues
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/story">Story</Link>
                <Link to="/artsearch">Art Search</Link>
                <Link to="/about">About</Link>

                {/* Conditionally render Account dropdown based on login state */}
                {isLoggedIn ? (
                    <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
                        <button onClick={toggleDropdown} className="dropbtn">
                            Profile
                        </button>
                        <div className="dropdown-content">
                            <Link to="/profile" onClick={toggleDropdown}>Profile</Link>
                            <Link to="/" onClick={handleLogout}>Logout</Link>
                        </div>
                    </div>
                ) : (
                    <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
                        <button onClick={toggleDropdown} className="dropbtn">
                            Account
                        </button>
                        <div className="dropdown-content">
                            <Link to="/signup" onClick={toggleDropdown}>Sign Up</Link>
                            <Link to="/login" onClick={toggleDropdown}>Login</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
