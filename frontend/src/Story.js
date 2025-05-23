import React, { useState, useRef } from 'react';
import './Story.css';
import SpeechInput from './SpeechInput';
import ReadAloudButton from './components/ReadAloudButton';

const Story = () => {
    const contentRef = useRef(null);
    const [storyText, setStoryText] = useState('');
    const [sectionsWithImages, setSectionsWithImages] = useState([]);
    const [selectedImagesPerSection, setSelectedImagesPerSection] = useState({});
    const [saveMessage, setSaveMessage] = useState('');
    const [language, setLanguage] = useState('EN');
    const [dataset, setDataset] = useState('Wiki');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    const handleSubmit = () => {
        setSectionsWithImages([]);
        setSelectedImagesPerSection({});

        fetch(`${API_URL}/api/select-images-per-section`, {
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
            setSectionsWithImages(data.sections);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setSectionsWithImages([]);
        });
    };

    const handleImageClick = (imageUrl, sectionIndex) => {
        setSelectedImagesPerSection(prev => ({ ...prev, [sectionIndex]: imageUrl }));
    };

    const handleSaveClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setSaveMessage('Please log in to save.');
            return;
        }

        const saveData = {
            generatedStory: storyText,
            selectedImages: Object.values(selectedImagesPerSection),
            language: language,
            dataset: dataset,
        };

        fetch(`${API_URL}/api/save-generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(saveData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setSaveMessage('Saved successfully!');
        })
        .catch(error => {
            console.error('Error saving:', error);
            setSaveMessage('Failed to save.');
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
                        "To the right of the text box, you can select the language for processing the story.",
                        "Finally, there is a submit button to click once you are done inputting the text."
                    ]}
                />
            </div>
            <div className="content-box">
                <h1>Write your story below!</h1>
                <div className="input-row">
                    <textarea
                        className="story-textbox"
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

            {sectionsWithImages.length > 0 && (
                <div className="content-box">
                    <h1>Choose one image for each section</h1>
                    {sectionsWithImages.map((sectionData, sectionIndex) => (
                        <div key={sectionIndex} className="section-images">
                            {sectionData.section && <p><strong>Section:</strong> {sectionData.section}</p>}
                            <div className="images-grid">
                                {sectionData.images.map((imageUrl, imageIndex) => (
                                    <div
                                        key={imageIndex}
                                        className={`image-container ${selectedImagesPerSection[sectionIndex] === imageUrl ? 'selected' : ''}`}
                                        onClick={() => handleImageClick(imageUrl, sectionIndex)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Section ${sectionIndex + 1} ${imageIndex + 1}`}
                                            className="generated-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        className="submit-button"
                        onClick={handleSaveClick}
                        disabled={Object.keys(selectedImagesPerSection).length !== sectionsWithImages.length}
                    >
                        Save Story
                    </button>
                    {saveMessage && <p>{saveMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default Story;