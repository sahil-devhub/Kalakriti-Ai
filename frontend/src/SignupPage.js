import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from './firebaseConfig';
// Import icons for a professional look
import { FaEnvelope, FaLock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
// Import the Link component to navigate after success
import { Link } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading spinner
  const [successMessage, setSuccessMessage] = useState(''); 

  const auth = getAuth(app);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (password.length < 6) {
        setError("Password should be at least 6 characters long.");
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Successfully created user:', userCredential.user);
      setSuccessMessage('Welcome to the community!');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Error signing up:", error);
      // Make Firebase errors more user-friendly
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // The success screen component
  if (successMessage) {
    return (
      <div className="content-container animate">
        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h2 className="logo">Account Created!</h2>
          <p className="tagline">{successMessage}</p>
          <Link to="/" className="create-button">
            Start Creating
          </Link>
        </div>
      </div>
    );
  }

  // The signup form component
  return (
    <div className="content-container animate">
      <div className="auth-card">
        <h1 className="logo">Join KalaKriti AI</h1>
        <p className="tagline">Start creating your marketing kits in seconds.</p>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="Choose a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="create-button" disabled={isLoading}>
            {isLoading ? (
              <FaSpinner className="spinner" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default SignupPage;

