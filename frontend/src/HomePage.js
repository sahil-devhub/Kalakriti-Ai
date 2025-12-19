import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';
import { 
  FaPaintBrush, FaCheckCircle, FaSpinner, FaDownload, FaCopy, 
  FaLinkedin, FaGithub, FaEnvelope, FaGlobe // Import icons for buttons
} from 'react-icons/fa';
import AudioRecorder from './AudioRecorder';
import ReactMarkdown from 'react-markdown';
import './App.css';

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

  // --- NEW: SCROLL ANIMATION LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []); // Run once on mount
  // -----------------------------------

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

      const apiResponse = await fetch('https://kalakriti-ai-3ivj.onrender.com/api/generate-kit', {
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
            
            {artFile && (
              <div className="upload-preview-container">
                  <img src={URL.createObjectURL(artFile)} alt="Art Preview" className="upload-preview-image" />
              </div>
            )}
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

      {/* --- NEW PROFESSIONAL NARRATIVE SECTION --- */}
      
      <div className="pro-landing-wrapper">

        {/* 1. WHAT IS KALAKRITI AI? */}
        <div className="mission-banner animate-on-scroll">
          <h2 className="mission-title">What is Kalakriti AI?</h2>
          <p className="mission-text">
            Creators are masters of their craft, but often struggle to tell their story digitally. 
            Existing tools are generic and robotic.
            <br /><br />
            <span className="highlight">Kalakriti AI bridges this gap.</span> We solved the problem of generic marketing 
            by building an AI that listens to your voice, understands cultural context and emotion, 
            and instantly generates professional, platform-specific marketing kits that feel authentically human.
          </p>
        </div>

        {/* 2. HOW TO USE IT */}
        <div>
          <h2 className="section-heading-center animate-on-scroll">How It Works</h2>
          <div className="steps-horizontal">
            <div className="step-sticker animate-on-scroll" style={{transitionDelay: '100ms'}}>
              <span className="step-number">1</span>
              <span className="step-icon-sticker">🖼️</span>
              <h3>Upload Visuals</h3>
              <p>Select the product or artwork you want to showcase to the world.</p>
            </div>
            <div className="step-sticker animate-on-scroll" style={{transitionDelay: '200ms'}}>
              <span className="step-number">2</span>
              <span className="step-icon-sticker">🎙️</span>
              <h3>Record Story</h3>
              <p>Speak naturally in your language. Explain the inspiration and effort behind it.</p>
            </div>
            <div className="step-sticker animate-on-scroll" style={{transitionDelay: '300ms'}}>
              <span className="step-number">3</span>
              <span className="step-icon-sticker">🚀</span>
              <h3>Launch Kit</h3>
              <p>Get instant, tailored captions and hashtags ready for social media.</p>
            </div>
          </div>
        </div>

        {/* 3. WHO DEVELOPED IT (UPDATED DESIGN) */}
        <div>
           <h2 className="section-heading-center animate-on-scroll">Meet the Creator</h2>
           <div className="creator-block animate-on-scroll">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
              alt="Sahil" 
              className="creator-photo" 
            />
            <h3 className="creator-name">Sahil</h3>
            <span className="creator-title">Software Development & AI Engineer</span>
            
            {/* UPDATED BUTTONS - ALL UNIFORM */}
            <div className="creator-links">
              <a href="https://sahil-devhub.github.io/Sahil.Dev/" target="_blank" rel="noreferrer" className="link-btn">
                <FaGlobe size={20} /> Portfolio
              </a>
              <a href="https://www.linkedin.com/in/sahil-kumar-33298a292/" target="_blank" rel="noreferrer" className="link-btn">
                <FaLinkedin size={20} /> LinkedIn
              </a>
              <a href="https://github.com/sahil-devhub" target="_blank" rel="noreferrer" className="link-btn">
                <FaGithub size={20} /> GitHub
              </a>
              <a href="mailto:sk3458162@gmail.com" className="link-btn">
                <FaEnvelope size={20} /> Contact
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 4. FOOTER */}
      <footer className="standard-footer animate-on-scroll">
        <p>© 2025 Kalakriti AI. Built with React, Python & Gemini API.</p>
      </footer>

    </div>
  );
}

export default HomePage;
