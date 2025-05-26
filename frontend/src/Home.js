import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import storyImage from './images/storyImage.png'; //<a target="_blank" href="https://icons8.com/icon/42763/book">Book</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import artImage from './images/artImage.png'; //<a target="_blank" href="https://icons8.com/icon/7695/search">Search</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import ReadAloudButton from './components/ReadAloudButton';

const Home = () => {
    const contentRef = useRef(null);

    return (
        <div>
            <div className="content-box" ref={contentRef}>
                <h1>Welcome to our Visual Cues application!</h1>
                <p>
                    This website allows you to interact with different AI models that can generate stories based on your input, or
                    suggest different paintings based on a search criteria.
                    <br />
                    To get started, please click on one of the two options down below!
                </p>
                <div className="images-container">
                    <Link to="/story" className="image-link">
                        <div className="image-wrapper">
                            <img src={storyImage} alt="Story Generation" className="clickable-image" />
                            <span className="image-text">Generate Images from a Story</span>
                        </div>
                    </Link>
                    <Link to="/artsearch" className="image-link">
                        <div className="image-wrapper">
                            <img src={artImage} alt="Art Search" className="clickable-image" />
                            <span className="image-text">Search for Art with Keywords</span>
                        </div>
                    </Link>
                </div>
                <ReadAloudButton
                    targetRef={contentRef}
                    extraText={[
                        "You can use the font slider to adjust the text size.",
                        "Use the navigation buttons to explore the app."
                    ]}
                />
            </div>
        </div>
    );
};

export default Home;