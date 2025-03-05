import React, { useState } from 'react';
import './Story.css';

const Story = () => {
    const [storyText, setStoryText] = useState('');

    const [images, setImages] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [responseText, setResponseText] = useState(null);

    const handleSubmit = () => {
        setResponseText(null);
        setImages([]);

        fetch('http://localhost:5001/select-images', {
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
        // setSelectedImage(null);
    };

    const handleChooseClick = () => {
        fetch('http://localhost:5001/generate-story', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageUrl: selectedImage.url,
                storyText: storyText,
            }),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setResponseText(data.text);
            closeModal();
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(responseText)
            .then(() => {
                console.log('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    const handleRegenerateClick = () => {
        handleChooseClick();
    };

    return (
        <div>
            <div className="content-box">
                <h1>Story Generation Instructions</h1>
                <p>
                    The story generation tool allows you to input the beginning of a story, or a memory who's details you do not fully remember.
                    After submitting the text, our AI model will suggest some paintings from our database. You can then select the one that you find most interesting, and the model will then generate a continuation to your story. 
                    <br></br>
                    Finally, if the generated story is to your liking, you can choose to keep it and continue generating images, or start over with a fresh new story.
                    <br></br>
                    To get started, please click on one of the two options down below!
                </p>
            </div>
            <div className="content-box">
                <h1>Input</h1>
                <textarea
                    className="story-textbox"
                    placeholder="Write your story here..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                />
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
                                    alt={`Generated Image ${index + 1}`}
                                    className="generated-image"
                                    onClick={() => handleImageClick(image)} // Add onClick handler
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
                            <button className="choose-button" onClick={handleChooseClick}>Choose</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display response text */}
            {responseText && (
                <div id='generated-story' className="content-box">
                    <h1>AI Generated Story</h1>
                    <p>{responseText}</p>
                    <div className="buttons-container">
                        <button className="submit-button" onClick={handleRegenerateClick}>Regenerate Story</button>
                        <button className="submit-button" onClick={copyToClipboard}>Copy Text</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Story;