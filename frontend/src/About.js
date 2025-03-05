import React from 'react';
import './About.css';
import poster from './images/poster.png'

const About = () => {
    return (
        <div>
            <div className="content-box">
                <h1>About Us</h1>
                <p>
                    Sample text
                </p>
            </div>
            <div className='content-box'>
            <h1>Thesis Poster</h1>
            <img src={poster} alt='poster'></img>
            </div>
        </div>
    );
};

export default About;