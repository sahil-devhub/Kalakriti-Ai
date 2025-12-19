import React from 'react';
import './PageLoader.css';

const PageLoader = () => {
    return (
        <div className="loader-overlay">
            <div className="neon-spinner"></div>
            <h3 className="loading-text">AUTHENTICATING...</h3>
        </div>
    );
};

export default PageLoader;