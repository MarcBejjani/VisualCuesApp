// src/components/AccessibilityPanel.js
import React from 'react';
import './AccessibilityPanel.css';
import { useTheme } from './ThemeContext';
import FontSizeAdjuster from './FontSizeAdjuster'; // <--- IMPORT NEW COMPONENT

const AccessibilityPanel = ({ onClose }) => {
    const { toggleTheme } = useTheme();

    return (
        <div className="accessibility-overlay" onClick={onClose}>
            <div className="accessibility-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-panel-button" onClick={onClose}>&times;</button>
                <h2>Accessibility Options</h2>
                <h3>Changle Color Theme</h3>
                <button id='toggle-theme-button' onClick={toggleTheme}>Toggle Theme</button>
                <FontSizeAdjuster />
            </div>
        </div>
    );
};

export default AccessibilityPanel;