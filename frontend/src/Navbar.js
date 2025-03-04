import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './images/logepl.jpg'

const Navbar = () => {
    return (
        <nav className="navbar">
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
            </div>
        </nav>
    );
};

export default Navbar;
