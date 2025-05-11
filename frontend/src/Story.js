import React, { useState, useRef } from 'react';
import './Story.css';
import SpeechInput from './SpeechInput';
import ReadAloudButton from './components/ReadAloudButton';

const Story = () => {
    const contentRef = useRef(null);

    const [storyText, setStoryText] = useState('');

    const [images, setImages] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [saveMessage, setSaveMessage] = useState('');

    const API_URL = 'http://localhost:5001';

    const handleSubmit = () => {
        setImages([]);
        
        fetch(`${API_URL}/api/select-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: storyText }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const imagesWithNames = data.images.map(imageUrl => {
                const imageName = imageUrl.split('/').pop(); // Extract filename from URL
                return { url: imageUrl, name: imageName };
            });
            setImages(imagesWithNames);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setImages([]); // Clear images on error
        });
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSaveMessage('');
    };

    const handleSaveClick = () => {
        const token = localStorage.getItem('token'); // Check if user is logged in

        if (!token) {
            setSaveMessage('Please log in to save the story to your account.');
            return;
        }

        fetch(`${API_URL}/api/save-generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Send the token for authentication
            },
            body: JSON.stringify({
                storyText: storyText,
                imageUrl: selectedImage.url,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setSaveMessage('Story saved successfully!');
        })
        .catch((error) => {
            console.error('There was a problem saving the story:', error);
            setSaveMessage('Failed to save the story. Please try again.');
        });
    };

    return (
        <div>
            <div className="content-box" ref={contentRef}>
                <h1>Story Generation Instructions</h1>
                <p>
                    The story generation tool allows you to input a story or a memory (or part of it).
                    After submitting the text, our AI model will suggest some paintings from our database which can hopefully help you remember more details of the story.
                    <br></br>
                    Feel free to keep on adding details to the text if the art pieces help you!
                </p>
                <ReadAloudButton
                    targetRef={contentRef}
                    extraText={[
                        "In the box below, you can enter text, or click a button to speak the words instead of typing.",
                        "Finally, there is a submit button to click once you are done inputting the text."
                    ]}
                />
            </div>
            <div className="content-box">
                <h1>Write your story below!</h1>
                <div className="input-row">
                    <textarea
                    className="search-textbox"
                    placeholder="Input some keywords here..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    />
                    <SpeechInput onChange={setStoryText} initialValue={storyText} />
                </div>
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
            {images.length > 0 && (
                <div className="content-box">
                    <h1>Image Selection</h1>
                    <p>Our AI model chose these paintings as the ones most resembling your story.
                    <br></br>
                    Please choose one of them to generate a continuation to your text.</p>
                    <div className="images-grid">
                        {images.map((image, index) => (
                            <div key={index} className="image-container">
                                <img
                                    src={image.url}
                                    alt={`Generated art piece ${index + 1}`}
                                    className="generated-image"
                                    onClick={() => handleImageClick(image)}
                                />
                                <span className="image-name">{image.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <img src={selectedImage.url} alt={selectedImage.name} className="modal-image" />
                        <div className="modal-info">
                            <span className="image-name">{selectedImage.name}</span>
                            <button className="choose-button" onClick={handleSaveClick}>Save to History</button>
                            {saveMessage && <p>{saveMessage}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Story;