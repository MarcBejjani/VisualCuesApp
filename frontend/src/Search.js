import React, { useState, useRef } from 'react';
import './Search.css';
import SpeechInput from './SpeechInput';
import ReadAloudButton from './components/ReadAloudButton';

const Search = () => {
    const contentRef = useRef(null);

    const [storyText, setStoryText] = useState('');
    const [images, setImages] = useState([]); // This will hold images from the *current* search
    const [selectedImages, setSelectedImages] = useState([]); // This will hold *all* selected images across searches

    const [language, setLanguage] = useState('en');
    const [dataset, setDataset] = useState('Wiki');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false);

    const [responseText, setResponseText] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    // Handle form submission to fetch images
    const handleSubmit = () => {
        setSubmitLoading(true);
        setResponseText(null);
        setImages([]); // Clear *only* the currently displayed images

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
            const newImages = data.images.map(imageUrl => {
                const imageName = imageUrl.split('/').pop();
                return { url: imageUrl, name: imageName };
            });
            setImages(newImages); // Update only the currently displayed images
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setImages([]);
        }).finally(() => {
            setSubmitLoading(false);
        });
    };

    // Handle image selection/deselection
    const handleImageToggle = (imageToToggle) => {
        setSelectedImages(prevSelected => {
            const isSelected = prevSelected.some(img => img.url === imageToToggle.url);
            if (isSelected) {
                // If already selected, remove it
                return prevSelected.filter(img => img.url !== imageToToggle.url);
            } else {
                // If not selected, add it
                return [...prevSelected, imageToToggle];
            }
        });
    };

    // Handle story generation from selected images
    const handleGenerateStory = () => {
        if (selectedImages.length === 0) {
            alert('Please select at least one image to generate a story.');
            return;
        }

        setGenerateLoading(true);
        setResponseText(null); // Clear previous story

        const imageUrls = selectedImages.map(img => img.url);

        fetch(`${API_URL}/api/generate-story`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageUrls: imageUrls,
                dataset: dataset
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
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            setResponseText('Failed to generate story. Please try again.');
        })
        .finally(() => {
            setGenerateLoading(false);
        });
    };

    // Copy generated story text to clipboard
    const copyToClipboard = () => {
        if (responseText) {
            navigator.clipboard.writeText(responseText)
                .then(() => {
                    console.log('Text copied to clipboard!');
                    setSaveMessage('Text copied to clipboard!');
                    setTimeout(() => setSaveMessage(''), 3000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    setSaveMessage('Failed to copy text.');
                    setTimeout(() => setSaveMessage(''), 3000);
                });
        }
    }

    // Regenerate the story
    const handleRegenerateClick = () => {
        handleGenerateStory();
    };

    const handleSaveClick = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setSaveMessage('Please log in to save the story to your account.');
            return;
        }

        if (!responseText) {
            setSaveMessage('No story to save.');
            return;
        }

        fetch(`${API_URL}/api/save-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                storyText: responseText,
                selectedImageUrls: selectedImages.map(img => img.url),
                storyDataset: dataset,
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
            setTimeout(() => setSaveMessage(''), 3000);
        })
        .catch((error) => {
            console.error('There was a problem saving the story:', error);
            setSaveMessage('Failed to save the story. Please try again.');
            setTimeout(() => setSaveMessage(''), 3000);
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
                <h1>Art Exploration Instructions</h1>
                <p>
                    The art exploration tool allows you to search for art pieces by typing in some keywords.
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
                <h1>Enter some keywords to search for art!</h1>
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
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="nl">Dutch</option>
                                <option value="es">Spanish</option>
                                <option value="pt">Portuguese</option>
                                <option value="de">German</option>
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
                    <button className="submit-button" onClick={handleSubmit} disabled={submitLoading}>
                        {submitLoading ? "Searching..." : "Submit"}
                    </button>
                    <SpeechInput onChange={setStoryText} initialValue={storyText} />
                </div>
            </div>

            {(images.length > 0 || selectedImages.length > 0) && ( // <--- Display if current search has images OR if any images are selected
                <div className="content-box">
                    <h1>Image Selection</h1>
                    <p>Our AI model chose these paintings as the ones most resembling your input.
                    <br></br>
                    Please **select one or more** of them to generate a story. Selected images will remain chosen across multiple searches.</p>
                    <div className="images-grid">
                        {/* Display currently searched images */}
                        {images.map((image, index) => (
                            <div
                                key={`search-${index}`} // <--- Use unique key for search results
                                className={`image-container ${selectedImages.some(img => img.url === image.url) ? 'selected' : ''}`}
                                onClick={() => handleImageToggle(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={`Generated Image ${index + 1}`}
                                    className="generated-image"
                                />
                                <span className="image-name">{image.name}</span>
                            </div>
                        ))}

                        {/* Display already selected images that are NOT in the current search results */}
                        {selectedImages.map((selectedImage, index) => {
                            const isAlreadyDisplayed = images.some(img => img.url === selectedImage.url);
                            if (!isAlreadyDisplayed) {
                                return (
                                    <div
                                        key={`selected-${index}`} // <--- Use unique key for selected images
                                        className="image-container selected" // Always marked as selected
                                        onClick={() => handleImageToggle(selectedImage)}
                                    >
                                        <img
                                            src={selectedImage.url}
                                            alt={`Selected Image ${index + 1}`}
                                            className="generated-image"
                                        />
                                        <span className="image-name">{selectedImage.name}</span>
                                    </div>
                                );
                            }
                            return null;
                        })}

                    </div>
                    <div className="buttons-container">
                        <button
                            className="submit-button"
                            onClick={handleGenerateStory}
                            disabled={generateLoading || selectedImages.length === 0}
                        >
                            {generateLoading ? 'Generating Story...' : `Generate Story from ${selectedImages.length} Selected Image(s)`} {/* <--- Dynamic button text */}
                        </button>
                        <button
                            className="submit-button"
                            onClick={() => setSelectedImages([])} // <--- NEW: Clear all selected images
                            disabled={selectedImages.length === 0}
                        >
                            Clear All Selections
                        </button>
                    </div>
                </div>
            )}

            {/* Display response text */}
            {responseText && (
                <div id='generated-story' className="content-box">
                    <h1>AI Generated Story</h1>
                    <p>{responseText}</p>
                    <div className="buttons-container">
                        <button className="submit-button" onClick={handleRegenerateClick} disabled={generateLoading}>Regenerate Story</button>
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