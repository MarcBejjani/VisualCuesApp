import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [savedArtSearches, setSavedArtSearches] = useState([]);
    const [savedStoryGenerations, setSavedStoryGenerations] = useState([]);
    const [expandedStory, setExpandedStory] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');

    const API_URL = 'http://localhost:5001';

    // Declare fetchUserProfile in the main component scope
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/retrieve-searches`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            setSavedArtSearches(data.savedArtSearches || []);
            setSavedStoryGenerations(data.savedStoryGenerations || []);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
        }

        fetchUserProfile(); // Call it on component mount
    }, []);

    const handleStoryClick = (story) => {
        setExpandedStory(story);
        setDeleteMessage('');
    };

    const closeModal = () => {
        setExpandedStory(null);
        setDeleteMessage('');
    };

    const handleDeleteClick = async () => {
        if (!expandedStory || !expandedStory._id) {
            console.error('No story or ID to delete.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setDeleteMessage('Please log in to delete.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/delete-generation/${expandedStory._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setDeleteMessage(errorData.message || 'Failed to delete generation.');
                console.error('Error deleting generation:', errorData);
                return;
            }

            setDeleteMessage('Generation deleted successfully.');
            fetchUserProfile();
            closeModal();
        } catch (error) {
            console.error('Error deleting generation:', error);
            setDeleteMessage('Failed to delete generation. Please try again.');
        }
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
                                onClick={() => handleStoryClick(story)}
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
                                onClick={() => handleStoryClick(story)}
                            >
                                <h3><strong>Date:</strong> {new Date(story.dateAdded).toLocaleString()}</h3>
                                <p>{story.text.substring(0, 50)}...</p>
                            </div>
                        ))
                    ) : (
                        <p>No saved art searches yet.</p>
                    )}
                </div>
            </div>

            {expandedStory && (
                <div className="modal-history">
                    <div className="modal-history-content">
                        <span className="history-close-button" onClick={closeModal}>&times;</span>
                        <h3><strong>Date:</strong> {new Date(expandedStory.dateAdded).toLocaleString()}</h3>
                        <p>{expandedStory.text}</p>
                        {expandedStory.images && Array.isArray(expandedStory.images) && expandedStory.images.length > 0 ? (
                            <div className="modal-images-grid">
                                {expandedStory.images.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Story Image ${index + 1}`}
                                        className="modal-history-image"
                                    />
                                ))}
                            </div>
                        ) : expandedStory.image ? (
                            <img src={expandedStory.image} alt="Art Search" className="modal-history-image" />
                        ) : null}
                        <div className="modal-actions">
                            <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
                            {deleteMessage && <p className="delete-message">{deleteMessage}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;