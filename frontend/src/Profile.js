import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [savedArtSearches, setSavedArtSearches] = useState([]);
    const [savedStoryGenerations, setSavedStoryGenerations] = useState([]);
    const [expandedStory, setExpandedStory] = useState(null);

    const API_URL = 'http://localhost:5001';

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token'); // Retrieve the authentication token
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/api/retrieve-searches`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Send token for authentication
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setSavedArtSearches(data.savedArtSearches || []); // Ensure it's an array
                setSavedStoryGenerations(data.savedStoryGenerations || []);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
        }

        fetchUserProfile();
    }, []);

    const handleStoryClick = (story) => {
        setExpandedStory(expandedStory === story ? null : story); // Toggle expansion using story object
    };

    const closeModal = () => {
        setExpandedStory(null); // Close modal
    };

    return (
        <div>
            <div className="content-box">
                <h1>Welcome to your dashboard, {username}!</h1>
                <p>You can check the history of your created stories or art pieces.</p>
            </div>

            <div className="content-box">
                <h1>Story Generation History</h1>
                <div className="story-list">
                    {savedStoryGenerations.length > 0 ? (
                        savedStoryGenerations.map((story, index) => (
                            <div
                                key={index}
                                className="story-box"
                                onClick={() => handleStoryClick(story)} // Pass story object
                            >
                                <h3><strong>Date:</strong> {new Date(story.dateAdded).toLocaleString()}</h3>
                                <p>{story.text.substring(0, 50)}...</p>
                            </div>
                        ))
                    ) : (
                        <p>No saved stories yet.</p>
                    )}
                </div>
            </div>

            <div className="content-box">
                <h1>Art Search History</h1>
                <div className="story-list">
                    {savedArtSearches.length > 0 ? (
                        savedArtSearches.map((story, index) => (
                            <div
                                key={index}
                                className="story-box"
                                onClick={() => handleStoryClick(story)} // Pass story object
                            >
                                <h3><strong>Date:</strong> {new Date(story.dateAdded).toLocaleString()}</h3>
                                <p>{story.text.substring(0, 50)}...</p>
                            </div>
                        ))
                    ) : (
                        <p>No saved stories yet.</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {expandedStory && (
                <div className="modal-history">
                    <div className="modal-history-content">
                        <span className="history-close-button" onClick={closeModal}>&times;</span>
                        <h3><strong>Date:</strong> {new Date(expandedStory.dateAdded).toLocaleString()}</h3>
                        <p>{expandedStory.text}</p>
                        {expandedStory.image && (
                            <img src={expandedStory.image} alt="Story" className="modal-history-image" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
