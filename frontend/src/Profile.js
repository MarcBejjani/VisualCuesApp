import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import storyImage from './images/storyImage.png'; //<a target="_blank" href="https://icons8.com/icon/42763/book">Book</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import artImage from './images/artImage.png'; //<a target="_blank" href="https://icons8.com/icon/7695/search">Search</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

const Profile = () => {
    return (
        <div className="content-box">
                <h1>Welcome to your dashboard!</h1>
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
                            <span className="image-text">Story Generation</span>
                        </div>
                    </Link>
                    <Link to="/artsearch" className="image-link">
                        <div className="image-wrapper">
                            <img src={artImage} alt="Art Search" className="clickable-image" />
                            <span className="image-text">Art Search</span>
                        </div>
                    </Link>
                </div>
        </div>
    );
};

export default Profile;