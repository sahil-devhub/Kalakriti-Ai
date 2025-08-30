/* --- App.js --- */
import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPaintBrush, FaMicrophone, FaCheckCircle, FaSpinner } from 'react-icons/fa';

function App() {
  const [artFile, setArtFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Animate elements on page load
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleArtUpload = (e) => {
    setArtFile(e.target.files[0]);
  };

  const handleStoryUpload = (e) => {
    setStoryFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!artFile || !storyFile) {
      // Use a custom message box instead of alert()
      setResponse({ error: 'Please upload both your art and story files.' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', artFile);
    formData.append('audio', storyFile);

    try {
      const apiResponse = await fetch('http://127.0.0.1:8080/generate-marketing-kit', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        // Log the status and throw a specific error
        console.error(`HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`);
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setResponse(result);
    } catch (error) {
      console.error("Error generating marketing kit:", error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setResponse({ error: 'Failed to connect to the backend. Is the server running?' });
      } else {
        setResponse({ error: `An error occurred: ${error.message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (response) {
      if (response.error) {
        return <p className="error-message">{response.error}</p>;
      }
      return (
        <div className="result-container">
          <h2>Your Marketing Kit</h2>
          <h3>Product Title:</h3>
          <p>{response.productTitle}</p>
          <h3>Product Description:</h3>
          <p>{response.productDescription}</p>
          <h3>Social Media Caption:</h3>
          <p>{response.socialMediaCaption}</p>
          <h3>Artisan Story:</h3>
          <p>{response.artisanStory}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <div className="background-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className={`content-container ${isAnimating ? 'animate' : ''}`}>
        <h1 className="logo">KalaKriti AI</h1>
        <p className="tagline">Bring your craft to the world. We'll tell your story.</p>

        <div className="upload-section">
          <div className="upload-card">
            <div className="icon-container">
              <FaPaintBrush className="upload-icon" />
              <span>1. Upload Your Art</span>
            </div>
            <label htmlFor="art-upload" className="custom-file-upload">
              Upload Art
            </label>
            <input id="art-upload" type="file" onChange={handleArtUpload} accept="image/*" />
            <span className="file-name">
              {artFile ? (
                <>
                  <FaCheckCircle className="check-icon" /> {artFile.name}
                </>
              ) : (
                'No file chosen'
              )}
            </span>
          </div>

          <div className="upload-card">
            <div className="icon-container">
              <FaMicrophone className="upload-icon" />
              <span>2. Upload Your Story (.mp3)</span>
            </div>
            <label htmlFor="story-upload" className="custom-file-upload">
              Upload Story
            </label>
            <input id="story-upload" type="file" onChange={handleStoryUpload} accept="audio/mp3" />
            <span className="file-name">
              {storyFile ? (
                <>
                  <FaCheckCircle className="check-icon" /> {storyFile.name}
                </>
              ) : (
                'No file chosen'
              )}
            </span>
          </div>
        </div>
        
        <button
          className="create-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" /> Generating...
            </>
          ) : (
            'CREATE MY MARKETING KIT'
          )}
        </button>

        {renderResult()}
      </div>
    </div>
  );
}

export default App;
