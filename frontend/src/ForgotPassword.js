// src/ForgotPassword.js
import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reusing your beautiful neon styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset link sent! Check your inbox.');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError('Failed to send reset email. Try again.');
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="login-container"> 
            <div className="login-card">
                <h2 className="login-title">Reset Password</h2>
                <p className="login-subtitle">Enter your email to receive a reset link.</p>
                
                {/* Show Success Message if sent */}
                {message ? (
                    <div style={{textAlign: 'center', margin: '20px 0'}}>
                        <div style={{fontSize: '3rem', marginBottom: '10px'}}>📩</div>
                        <p style={{color: '#4ade80', fontSize: '1.1rem', fontWeight: 'bold'}}>{message}</p>
                        <Link to="/login" className="submit-btn" style={{display: 'block', textDecoration: 'none', marginTop: '20px', textAlign: 'center'}}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p style={{color: '#ff4444', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{marginTop: '20px', textAlign: 'center'}}>
                             <Link to="/login" style={{color: '#a5b4fc', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s'}}>
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;