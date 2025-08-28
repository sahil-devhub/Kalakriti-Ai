// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:8080'; // Adjust to your backend URL (local or deployed)

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [brandImages, setBrandImages] = useState([]);
  const [storyAudio, setStoryAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('marketing');

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: '#0A0A1A',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#00FFFF', '#FF00FF'],
      },
      links: {
        color: '#CCCCCC',
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0] || (e.target.files.length > 0 ? Array.from(e.target.files) : null));
  };

  const handleSubmit = async (endpoint, formData) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: endpoint === '/generate-audio-story' ? 'blob' : 'json',
      });
      if (endpoint === '/generate-audio-story') {
        const url = URL.createObjectURL(res.data);
        setResponse({ type: 'audio', url });
      } else {
        setResponse(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onMarketingSubmit = (e) => {
    e.preventDefault();
    if (!imageFile || !audioFile) {
      setError('Please upload both image and audio.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('audio', audioFile);
    handleSubmit('/generate-marketing-kit', formData);
  };

  const onBrandSubmit = (e) => {
    e.preventDefault();
    if (brandImages.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    const formData = new FormData();
    brandImages.forEach((file) => formData.append('images', file));
    handleSubmit('/generate-brand-kit', formData);
  };

  const onAudioSubmit = (e) => {
    e.preventDefault();
    if (!storyAudio) {
      setError('Please upload an audio file.');
      return;
    }
    const formData = new FormData();
    formData.append('audio', storyAudio);
    handleSubmit('/generate-audio-story', formData);
  };

  useEffect(() => {
    // Typing animation for tagline
    const tagline = document.querySelector('#tagline');
    if (tagline) {
      const text = tagline.innerText;
      tagline.innerText = '';
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          tagline.innerText += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="max-w-[800px] w-full z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] mb-4 text-center"
        >
          KalaKriti AI
        </motion.h1>
        <motion.p
          id="tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl text-gray-400 mb-8 text-center"
        >
          Bring your craft to the world. We'll tell your story.
        </motion.p>

        {/* Tabs for different features */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 rounded-l-lg ${activeTab === 'marketing' ? 'bg-gradient-to-r from-pink-500 to-cyan-500' : 'bg-gray-800'}`}
          >
            Marketing Kit
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2 ${activeTab === 'brand' ? 'bg-gradient-to-r from-pink-500 to-cyan-500' : 'bg-gray-800'}`}
          >
            Brand Kit
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-r-lg ${activeTab === 'audio' ? 'bg-gradient-to-r from-pink-500 to-cyan-500' : 'bg-gray-800'}`}
          >
            Audio Story
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'marketing' && (
            <motion.form
              key="marketing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={onMarketingSubmit}
              className="space-y-6"
            >
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-transparent hover:border-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300">
                <label className="block text-cyan-400 mb-2 flex items-center">
                  <span className="material-icons mr-2">brush</span> Upload Your Art (Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setImageFile)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                >
                  Choose Image
                </label>
                {imageFile && (
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mt-2 text-green-400 flex items-center"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" /> {imageFile.name}
                  </motion.p>
                )}
              </div>
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-transparent hover:border-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300">
                <label className="block text-pink-400 mb-2 flex items-center">
                  <span className="material-icons mr-2">mic</span> Upload Your Story (.mp3)
                </label>
                <input
                  type="file"
                  accept="audio/mp3"
                  onChange={(e) => handleFileChange(e, setAudioFile)}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]"
                >
                  Choose Audio
                </label>
                {audioFile && (
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mt-2 text-green-400 flex items-center"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" /> {audioFile.name}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-full font-bold hover:brightness-110 transition-all duration-300 animate-pulse-glow"
              >
                {loading ? 'Creating...' : 'CREATE MY MARKETING KIT'}
              </button>
            </motion.form>
          )}

          {activeTab === 'brand' && (
            <motion.form
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={onBrandSubmit}
              className="space-y-6"
            >
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-transparent hover:border-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300">
                <label className="block text-cyan-400 mb-2 flex items-center">
                  <span className="material-icons mr-2">image</span> Upload Your Images (Multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, setBrandImages)}
                  className="hidden"
                  id="brand-images-upload"
                />
                <label
                  htmlFor="brand-images-upload"
                  className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                >
                  Choose Images
                </label>
                {brandImages.length > 0 && (
                  <motion.ul
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mt-2 text-green-400"
                  >
                    {brandImages.map((file, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" /> {file.name}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-full font-bold hover:brightness-110 transition-all duration-300 animate-pulse-glow"
              >
                {loading ? 'Generating...' : 'GENERATE BRAND KIT'}
              </button>
            </motion.form>
          )}

          {activeTab === 'audio' && (
            <motion.form
              key="audio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              onSubmit={onAudioSubmit}
              className="space-y-6"
            >
              <div className="bg-[#1E1E2E] p-6 rounded-xl border border-transparent hover:border-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300">
                <label className="block text-pink-400 mb-2 flex items-center">
                  <span className="material-icons mr-2">audiotrack</span> Upload Your Audio (.mp3)
                </label>
                <input
                  type="file"
                  accept="audio/mp3"
                  onChange={(e) => handleFileChange(e, setStoryAudio)}
                  className="hidden"
                  id="story-audio-upload"
                />
                <label
                  htmlFor="story-audio-upload"
                  className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]"
                >
                  Choose Audio
                </label>
                {storyAudio && (
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mt-2 text-green-400 flex items-center"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" /> {storyAudio.name}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-full font-bold hover:brightness-110 transition-all duration-300 animate-pulse-glow"
              >
                {loading ? 'Processing...' : 'GENERATE AUDIO STORY'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-900 rounded-lg flex items-center animate-shake"
          >
            <XCircleIcon className="w-5 h-5 mr-2" /> {error}
          </motion.div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-[#1E1E2E] rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Generated Result</h2>
            {response.type === 'audio' ? (
              <div>
                <audio controls src={response.url} className="w-full" />
                <a href={response.url} download="kalakriti_story.mp3" className="text-cyan-400 hover:underline">
                  Download Audio
                </a>
              </div>
            ) : (
              <pre className="text-gray-300 overflow-auto">{JSON.stringify(response, null, 2)}</pre>
            )}
            {response.generatedLogo && (
              <img src={`data:image/png;base64,${response.generatedLogo.imageBase64}`} alt="Generated Logo" className="mt-4 max-w-full" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;