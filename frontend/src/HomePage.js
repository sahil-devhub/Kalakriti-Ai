import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';
import { 
  FaPaintBrush, FaCheckCircle, FaSpinner, FaDownload, FaCopy, 
  FaLinkedin, FaGithub, FaEnvelope, FaGlobe, FaCamera, FaTimes 
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

// --- HELPER: Convert Camera Image to File Object ---
const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

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
  
  // --- NATIVE CAMERA STATES ---
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Clean up stream when component unmounts
  useEffect(() => {
      return () => {
          if (stream) {
              stream.getTracks().forEach(track => track.stop());
          }
      };
  }, [stream]);

  // Scroll Animation Logic
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
  }, []);

  const handleArtUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtFile(e.target.files[0]);
      artFileRef.current = e.target.files[0];
      closeCamera(); // Ensure camera is off
    }
  };

  // --- NATIVE CAMERA FUNCTIONS ---
  const startCamera = async () => {
    setShowCamera(true);
    try {
        // Try getting the environment (back) camera first
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    } catch (err) {
        console.log("Back camera failed, trying front camera...", err);
        try {
            // Fallback to any available camera (Laptop/Front)
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(fallbackStream);
            if (videoRef.current) {
                videoRef.current.srcObject = fallbackStream;
            }
        } catch (error) {
            alert("Could not access camera. Please allow permissions in your browser.");
            setShowCamera(false);
        }
    }
  };

  const closeCamera = () => {
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
      }
      setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Match canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to file
        const imageSrc = canvas.toDataURL('image/jpeg');
        const file = dataURLtoFile(imageSrc, "captured_photo.jpg");
        
        setArtFile(file);
        artFileRef.current = file;
        closeCamera();
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
            
            {/* --- NATIVE CAMERA LOGIC --- */}
            {!showCamera ? (
                <>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px'}}>
                        <label htmlFor="art-upload" className="custom-file-upload">
                           Choose File
                        </label>
                        <input id="art-upload" type="file" onChange={handleArtUpload} accept="image/*" />
                        
                        {/* CAMERA BUTTON */}
                        <button 
                            className="custom-file-upload" 
                            style={{background: 'linear-gradient(45deg, #ec4899, #8b5cf6)', border: 'none'}}
                            onClick={startCamera}
                        >
                           <FaCamera style={{marginRight: '5px'}}/> Camera
                        </button>
                    </div>
                    
                    <span className="file-name" style={{marginTop:'10px', justifyContent:'center'}}>
                        {artFile ? <><FaCheckCircle className="check-icon" /> {artFile.name}</> : 'No file chosen'}
                    </span>

                    {/* PREVIEW IMAGE */}
                    {artFile && (
                        <div className="upload-preview-container">
                            <img src={URL.createObjectURL(artFile)} alt="Art Preview" className="upload-preview-image" />
                        </div>
                    )}
                </>
            ) : (
                /* --- NATIVE VIDEO ELEMENT (NO LIBRARY) --- */
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%'}}>
                    <div style={{
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        border: '2px solid #ec4899',
                        boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
                        width: '100%',
                        maxWidth: '400px',
                        background: '#000'
                    }}>
                        {/* THE HTML5 VIDEO TAG */}
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline
                            style={{width: '100%', height: 'auto', display: 'block'}}
                        />
                        <canvas ref={canvasRef} style={{display: 'none'}} />
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button 
                            className="create-button" 
                            onClick={capturePhoto}
                            style={{padding: '0.5rem 1.5rem', fontSize: '0.9rem'}}
                        >
                            Capture
                        </button>
                        <button 
                            className="create-button" 
                            onClick={closeCamera}
                            style={{padding: '0.5rem 1rem', fontSize: '0.9rem', background: '#333'}}
                        >
                            <FaTimes />
                        </button>
                    </div>
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

      {/* --- PROFESSIONAL NARRATIVE SECTION (KEPT INTACT) --- */}
      <div className="pro-landing-wrapper">
        
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

        <div>
           <h2 className="section-heading-center animate-on-scroll">Meet the Creator</h2>
           <div className="creator-block animate-on-scroll">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
              alt="Sahil" 
              className="creator-photo" 
            />
            <h3 className="creator-name">Sahil</h3>
            <span className="creator-title">Full Stack Developer & AI Engineer</span>
            
            <div className="creator-links">
              <a href="https://your-portfolio-site.com" target="_blank" rel="noreferrer" className="link-btn">
                <FaGlobe size={20} /> Portfolio
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="link-btn">
                <FaLinkedin size={20} /> LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="link-btn">
                <FaGithub size={20} /> GitHub
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sk3458162@gmail.com" 
                target="_blank" 
                rel="noreferrer" 
                className="link-btn"
              >
                <FaEnvelope size={20} /> Contact
              </a>
            </div>

          </div>
        </div>

      </div>

      <footer className="standard-footer animate-on-scroll">
        <p>© 2025 Kalakriti AI, Designed & Developed by Sahil.</p>
      </footer>
    </div>
  );
}

export default HomePage;
