import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [savedSearches, setSavedSearches] = useState([]);
    const [expandedStoryIndex, setExpandedStoryIndex] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token'); // Retrieve the authentication token
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5001/api/retrieve-searches', {
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
                setSavedSearches(data.savedSearches || []); // Ensure it's an array
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

    const handleStoryClick = (index) => {
        setExpandedStoryIndex(expandedStoryIndex === index ? null : index); // Toggle expansion
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
                    {savedSearches.length > 0 ? (
                        savedSearches.map((story, index) => (
                            <div
                                key={index}
                                className={`story-box ${expandedStoryIndex === index ? 'expanded' : ''}`}
                                onClick={() => handleStoryClick(index)}
                            >
                                <h3><strong>Date:</strong> {new Date(story.dateAdded).toLocaleString()}</h3> {/* Formatted date */}
                                {expandedStoryIndex === index ? (
                                    <p>{story.text}</p> // Full text when expanded
                                ) : (
                                    <p>{story.text.substring(0, 50)}...</p> // Snippet when collapsed
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No saved stories yet.</p>
                    )}
                </div>
            </div>

            <div className="content-box">
                <h1>Art Search History</h1>
            </div>
        </div>
    );
};

export default Profile;
