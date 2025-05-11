import React, { useRef } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import './ReadAloudButton.css';

const ReadAloudButton = ({ targetRef, extraText = [], excludeClassName = '' }) => {
    const { isReading, readAloud, cancel } = useTextToSpeech();
    const buttonRef = useRef(null);

    const handleClick = () => {
        if (isReading) {
            cancel();
            return;
        }

        if (!targetRef?.current) return;

        const children = Array.from(targetRef.current.children);
        const blocks = children
            .filter(el =>
                !el.contains(buttonRef.current) &&
                (!excludeClassName || !el.classList.contains(excludeClassName))
            )
            .map(el => el.innerText.trim())
            .filter(Boolean)
            .concat(extraText);

        readAloud(blocks);
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={`tts-button ${isReading ? 'reading' : ''}`}
        >
            {isReading ? '🔊 Reading... Click to Cancel' : '🔊 Read Aloud'}
        </button>
    );
};

export default ReadAloudButton;