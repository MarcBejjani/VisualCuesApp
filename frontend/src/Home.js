import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import storyImage from './images/storyImage.png'; //<a target="_blank" href="https://icons8.com/icon/42763/book">Book</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import artImage from './images/artImage.png'; //<a target="_blank" href="https://icons8.com/icon/7695/search">Search</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

const Home = () => {
    const [fontSize, setFontSize] = useState(() => {
        const rootFont = getComputedStyle(document.documentElement).getPropertyValue('--base-font-size');
        return parseInt(rootFont) || 20;
      });
    
      useEffect(() => {
        document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
      }, [fontSize]);

    return (
        <div>
            <div className="content-box">
                <h1>Welcome to our Visual Cues application!</h1>
                <p>
                    This website allows you to interact with different AI models that can generate stories based on your input, or
                    suggest different paintings based on a search criteria.
                    <br></br>
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
            </div>
            <div className="content-box">
                    <label htmlFor="font-size-slider">
                        Adjust Font Size: {fontSize}px
                    </label>
                    <input
                        id="font-size-slider"
                        type="range"
                        min="14"
                        max="32"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        style={{ width: '100%', margin: '1rem 0' }}
                    />
                    <p>
                        This text will scale dynamically based on the font size you select. Try moving the slider!
                    </p>
            </div>
        </div>
    );
};

export default Home;