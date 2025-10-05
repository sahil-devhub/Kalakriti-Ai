import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';
import { FaPaintBrush, FaMicrophone, FaCheckCircle, FaSpinner } from 'react-icons/fa';

function HomePage() {
  const [artFile, setArtFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

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
      setResponse({ error: 'Please upload both your art and story files.' });
      return;
    }
    if (!user) {
      setResponse({ error: 'You must be logged in to create a kit.' });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('image', artFile);
      formData.append('audio', storyFile);

      const apiResponse = await fetch('http://127.0.0.1:5000/api/generate-marketing-kit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({ error: `HTTP error! status: ${apiResponse.status}` }));
        throw new Error(errorData.error);
      }

      const result = await apiResponse.json();
      console.log("Received from backend:", JSON.stringify(result, null, 2)); 
      setResponse(result);

    } catch (error) {
      console.error("Error generating marketing kit:", error);
      setResponse({ error: error.message || 'An error occurred during processing. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- UPDATED SECTION ---
  const renderResult = () => {
    if (!response) return null;
    if (response.error) {
      return <div className="error-message">{response.error}</div>;
    }
    
    // Simplified variable assignments to match the new, consistent backend response.
    const productTitle = response.productTitle;
    const productDescription = response.productDescription;
    const mainPostDescription = response.mainPostDescription;
    const hashtags = response.hashtags; // Using the new 'hashtags' key
    const artisanStory = response.artisanStory;


    return (
        <div className="result-container animate">
            <h2 className="result-title">Your Marketing Kit</h2>
            
            {productTitle && <div className="result-item">
                <h3>Product Title</h3>
                <p>{productTitle}</p>
            </div>}

            {productDescription && <div className="result-item">
                <h3>Product Description</h3>
                <p>{productDescription}</p>
            </div>}

            {mainPostDescription && <div className="result-item">
                <h3>Main Post Description</h3>
                <p>{mainPostDescription}</p>
            </div>}
            
            {hashtags && <div className="result-item">
                <h3>Hashtags (Copy/Paste)</h3>
                <p className="hashtags">{hashtags}</p>
            </div>}

            {artisanStory && <div className="result-item">
                <h3>Artisan Story</h3>
                <p>{artisanStory}</p>
            </div>}
        </div>
    );
  };
  // --- END OF UPDATED SECTION ---

  return (
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
            {artFile ? <><FaCheckCircle className="check-icon" /> {artFile.name}</> : 'No file chosen'}
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
            {storyFile ? <><FaCheckCircle className="check-icon" /> {storyFile.name}</> : 'No file chosen'}
          </span>
        </div>
      </div>

      <button className="create-button" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? <><FaSpinner className="spinner" /> Generating...</> : 'CREATE MY MARKETING KIT'}
      </button>

      {response && renderResult()}
    </div>
  );
}

export default HomePage;