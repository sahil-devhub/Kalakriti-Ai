import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';
import { 
  FaPaintBrush, FaCheckCircle, FaSpinner, FaDownload, FaCopy
} from 'react-icons/fa';
import AudioRecorder from './AudioRecorder';
import ReactMarkdown from 'react-markdown';

const AVAILABLE_PLATFORMS = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter_x', name: 'Twitter (X)' },
  { id: 'linkedin', name: 'LinkedIn' },
];

function RenderResult({ response, handleCopyText, handleDownloadImage }) {
  if (!response) return null;
  if (response.error) {
    return <div className="error-message">{response.error}</div>;
  }

  const { productTitle, productDescription, productHighlights, post, hashtags } = response;
  
  const fullTextToCopy = `
${productTitle}\n\n${productDescription}\n\n✨ Product Highlights & Story ✨\n${productHighlights}\n\n${post}\n\n${hashtags}
`.trim();

  return (
    <div className="result-container animate">
      <h2 className="result-title">{productTitle}</h2>
      <div className="result-item">
        <h3>Product Description</h3>
        <ReactMarkdown>{productDescription}</ReactMarkdown>
      </div>
      <div className="result-item">
        <h3>Product Highlights & Story</h3>
        <ReactMarkdown>{productHighlights}</ReactMarkdown>
      </div>
      <div className="result-item">
        <h3>Social Media Caption</h3>
        <ReactMarkdown>{post}</ReactMarkdown>
        <p className="hashtags">{hashtags}</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => handleCopyText(fullTextToCopy)} className="action-btn"><FaCopy /> Copy Full Kit</button>
        <button onClick={handleDownloadImage} className="action-btn"><FaDownload /> Download Image</button>
      </div>
    </div>
  );
}

function HomePage() {
  const [artFile, setArtFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);
  const artFileRef = useRef(null); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [activePlatform, setActivePlatform] = useState('instagram'); 
  
  const [audioBlob, setAudioBlob] = useState(null);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleArtUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtFile(e.target.files[0]);
      artFileRef.current = e.target.files[0];
    }
  };
  
  const handleSubmit = async () => {
    if (!artFile || !audioBlob) {
      setResponse({ error: 'Please upload your art and record your story.' });
      return;
    }
    if (!user) {
      setResponse({ error: 'You must be logged in to create a kit.' });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append('image', artFile);
      formData.append('audio', audioBlob, 'story.webm');
      formData.append('platform', activePlatform);

      const apiResponse = await fetch('https://kalakriti-ai-3ivj.onrender.com/generate-kit', {
        method: 'POST',
        body: formData,
      });

      const resultData = await apiResponse.json();
      if (!apiResponse.ok) throw new Error(resultData.error || 'An unknown error occurred.');
      setResponse(resultData);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadImage = () => {
    if (artFileRef.current) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(artFileRef.current);
        link.download = artFileRef.current.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  };

  const handleCopyText = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Copied to clipboard!');
      }).catch(err => console.error('Failed to copy text: ', err));
  };
  
  return (
    <div className={`content-container ${isAnimating ? 'animate' : ''}`}>
      <h1 className="logo">KalaKriti AI</h1>
      <p className="tagline">Bring your craft to the world. We'll tell your story.</p>
      
      <div className="upload-section">
        <div className="upload-card">
            <div className="icon-container"><FaPaintBrush className="upload-icon" /><span>1. Upload Your Art</span></div>
            <label htmlFor="art-upload" className="custom-file-upload">Choose File</label>
            <input id="art-upload" type="file" onChange={handleArtUpload} accept="image/*" />
            <span className="file-name">{artFile ? <><FaCheckCircle className="check-icon" /> {artFile.name}</> : 'No file chosen'}</span>
            
            {/* --- NEW PREVIEW SECTION START --- */}
            {artFile && (
              <div className="upload-preview-container">
                  <img src={URL.createObjectURL(artFile)} alt="Art Preview" className="upload-preview-image" />
              </div>
            )}
            {/* --- NEW PREVIEW SECTION END --- */}
        </div>
        
        <AudioRecorder onRecordingComplete={setAudioBlob} />
      </div>

      <div className="platform-selector">
        <h3>Choose a Platform</h3>
        <div className="platform-btn-group">
          {AVAILABLE_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              className={`platform-btn ${activePlatform === platform.id ? 'active' : ''}`}
              onClick={() => setActivePlatform(platform.id)}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      <button className="create-button" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? <><FaSpinner className="spinner" /> Generating...</> : `CREATE KIT FOR ${activePlatform.toUpperCase()}`}
      </button>

      {response && (
        <RenderResult
          response={response}
          handleCopyText={handleCopyText}
          handleDownloadImage={handleDownloadImage}
        />
      )}
    </div>
  );
}

export default HomePage;
