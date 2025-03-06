import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Footer from './Footer';
import Story from './Story';
import Search from './Search';
import SignUp from './SignUp';
import Login from './Login';
import './App.css';

function App() {
    return (
        <div id="app-container">
            <Navbar />
            <div className="content-wrapper">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path='/story' element={<Story />} />
                    <Route path="/artsearch" element={<Search />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;