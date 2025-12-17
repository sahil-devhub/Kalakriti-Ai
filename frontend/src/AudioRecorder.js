import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStopCircle, FaTrash, FaCheckCircle } from 'react-icons/fa';

function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        // FIX: Create blob directly. No mixing, no FFmpeg.
        const rawAudioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(rawAudioBlob);
        setAudioUrl(url);
        onRecordingComplete(rawAudioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please check your settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    onRecordingComplete(null);
  };

  return (
    <div className="upload-card">
      <div className="icon-container"><FaMicrophone className="upload-icon" /><span>2. Record Your Story</span></div>
      
      {!isRecording && !audioUrl && (
        <button onClick={startRecording} className="record-btn start">
          <FaMicrophone /> Record
        </button>
      )}

      {isRecording && (
        <button onClick={stopRecording} className="record-btn stop">
          <FaStopCircle /> Stop Recording
        </button>
      )}

      {audioUrl && (
        <div className="recording-complete">
          <span className="file-name"><FaCheckCircle className="check-icon" /> Story Recorded!</span>
          <div className="audio-controls">
            <audio src={audioUrl} controls />
            <button onClick={resetRecording} className="record-btn delete"><FaTrash /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;