import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import storyImage from './images/storyImage.png';
import artImage from './images/artImage.png';
import { useReadAloud } from './contexts/ReadAloudContext';

const Home = () => {
    const contentRef = useRef(null);
    const { registerContent } = useReadAloud();

    useEffect(() => {
        registerContent(contentRef, [
            "To get started, please click on one of the two options presented below.",
            "Generate Images from a Story allows you to write a story and get images suggested for different sections.",
            "Search for Art with Keywords allows you to search for paintings using keywords and generate a story from selected images."
        ]);
        return () => registerContent(null);
    }, [registerContent]);

    return (
        <div className="home-container">
            <div className="hero-section" ref={contentRef}>
                <h1 className="hero-title">Welcome to our Art Evoke application!</h1>
                <p className="hero-description">
                    This website allows you to interact with different AI models that can suggest different paintings based on a provided story,
                    or generate a story based on selected art.
                    <br />
                    To get started, please click on one of the two options down below!
                </p>
            </div>

            <div className="options-section">
                <div className="options-grid">
                    <Link to="/story" className="option-card">
                        <div className="option-icon-wrapper">
                            <img src={storyImage} alt="Generate Images from a Story" className="option-icon" />
                        </div>
                        <span className="option-text">Generate Images from a Story</span>
                    </Link>
                    <Link to="/artsearch" className="option-card">
                        <div className="option-icon-wrapper">
                            <img src={artImage} alt="Search for Art with Keywords" className="option-icon" />
                        </div>
                        <span className="option-text">Search for Art with Keywords</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;