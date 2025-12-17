import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from './firebaseConfig';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

import './SignupPage.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        navigate('/'); // Navigate to the home page
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsSuccess(true);
    } catch (err) {
      // (Error handling logic remains the same)
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="signup-container">
        <div className="success-message-card">
          <FaCheckCircle className="success-icon" />
          <h1>Account Created!</h1>
          <p>Redirecting you to the home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="auth-card">
        <h1>Join KalaKriti AI</h1>
        <p className="tagline">Start creating your marketing kits in seconds.</p>
        
        {/* --- FIX: Moved onSubmit from the button to the form element --- */}
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (min. 6 characters)"
              required
            />
          </div>
          {/* --- FIX: Button type is now "submit" --- */}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <FaSpinner className="spinner" /> : 'Create Account'}
          </button>
          
          {error && <p className="auth-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;

