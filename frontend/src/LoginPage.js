// src/LoginPage.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import PageLoader from './PageLoader';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // 1. New State for Password Visibility
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 
        setIsLoading(true);

        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            setTimeout(() => {
                 navigate('/'); 
            }, 2000);

        } catch (error) {
            setIsLoading(false);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <>
            {isLoading && <PageLoader />}

            <div className="login-container"> 
                <div className="login-card">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Login to continue creating your marketing kits.</p>
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={isLoading} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            
                            {/* 2. Wrapper for Input + Eye Icon */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    // 3. Dynamic Type: Text or Password
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                    style={{ paddingRight: '40px' }} // Make room for the icon
                                />
                                
                                {/* 4. The Eye Icon Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#a5b4fc', // Matches your theme color
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ? (
                                        // Eye Open Icon (SVG)
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    ) : (
                                        // Eye Off Icon (SVG)
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div style={{textAlign: 'right', marginTop: '8px'}}>
                                <Link to="/forgot-password" style={{color: '#c084fc', fontSize: '0.85rem', textDecoration: 'none'}}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && <p style={{color: '#ff4444', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Login'}
                        </button>
                    </form>

                    <p style={{marginTop: '20px', textAlign: 'center', color: '#94a3b8'}}>
                        Don't have an account? <Link to="/signup" style={{color: '#c084fc', fontWeight: 'bold', textDecoration: 'none'}}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
