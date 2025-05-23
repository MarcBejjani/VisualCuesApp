import React, { useState, useRef } from 'react';
import './Search.css';
import SpeechInput from './SpeechInput';
import ReadAloudButton from './components/ReadAloudButton'

const Search = () => {
    const contentRef = useRef(null);

    const [storyText, setStoryText] = useState('');
    const [images, setImages] = useState([]);
    const [language, setLanguage] = useState('EN');
    const [dataset, setDataset] = useState('Wiki');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    // Handle form submission to fetch images
    const handleSubmit = () => {
        setResponseText(null);
        setImages([]);

        fetch(`${API_URL}/api/search-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: storyText, language: language, dataset: dataset }),
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

    // Handle image selection
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Handle story generation
    const handleChooseClick = () => {
        setLoading(true);
        fetch(`${API_URL}/api/generate-story`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageUrl: selectedImage.url, dataset: dataset
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
        })
        .finally(() => {
            setLoading(false);
        });
    };

    // Copy generated story text to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(responseText)
            .then(() => {
                console.log('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    // Regenerate the story
    const handleRegenerateClick = () => {
        handleChooseClick();
    };

    const handleSaveClick = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setSaveMessage('Please log in to save the story to your account.');
            return;
        }

        // If user is logged in, send request to save the story
        fetch(`${API_URL}/api/save-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                storyText: responseText,
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

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleDatasetChange = (event) => {
        setDataset(event.target.value);
    };

    return (
        <div>
            <div className="content-box" ref={contentRef}>
                <h1>Art Search Instructions</h1>
                <p>
                    The story generation tool allows you to search for art pieces by typing in some keywords.
                    Our AI model will return some paintings from our database, and you can then select the one that you find most interesting, and the model will then generate a story based on it.
                    <br></br>
                    Finally, if the generated story is not to your liking, you can choose to regenerate a new story, or start over.
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
                <h1>Enter some keywords to Search for Art!</h1>
                <div className="input-row">
                    <textarea
                        className="search-textbox"
                        placeholder="Input some keywords here..."
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                    />
                    <div className="select-row">
                        <div className="select-group">
                            <label htmlFor="language-select-id" className="select-label">Select Language:</label>
                            <select
                                id="language-select-id"
                                className="language-select"
                                value={language}
                                onChange={handleLanguageChange}
                            >
                                <option value="EN">EN</option>
                                <option value="FR">FR</option>
                            </select>
                        </div>
                        <div className="select-group">
                            <label htmlFor="dataset-select-id" className="select-label">Select Dataset:</label>
                            <select
                                id="dataset-select-id"
                                className="language-select"
                                value={dataset}
                                onChange={handleDatasetChange}
                            >
                                <option value="Wiki">Wiki</option>
                                <option value="SemArt">SemArt</option>
                                <option value="Museum">Museum</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='input-buttons'>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    <SpeechInput onChange={setStoryText} initialValue={storyText} />
                </div>
            </div>
            {images.length > 0 && (
                <div className="content-box">
                    <h1>Image Selection</h1>
                    <p>Our AI model chose these paintings as the ones most resembling your input.
                    <br></br>
                    Please choose one of them to generate a continuation to your text.</p>
                    <div className="images-grid">
                        {images.map((image, index) => (
                            <div key={index} className="image-container">
                                <img
                                    src={image.url}
                                    alt={`Generated Image ${index + 1}`}
                                    className="generated-image"
                                    onClick={() => handleImageClick(image)}
                                />
                                <span className="image-name">{image.name}</span>
                            </div>
                        ))}
                    </div>
                    <button id="images-button" className="submit-button" onClick={handleSubmit}>Refresh Images</button>
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
                            <button
                                className="choose-button"
                                onClick={handleChooseClick}
                                disabled={loading}
                            >
                                {loading ? 'Generating Story...' : 'Choose'}
                            </button>
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
                        <button className="submit-button" onClick={handleSaveClick}>Save to Account</button>
                    </div>
                    {saveMessage && <p>{saveMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default Search;