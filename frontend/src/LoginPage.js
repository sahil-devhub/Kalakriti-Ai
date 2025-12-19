// src/LoginPage.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
// 1. Import the new Loader component
import PageLoader from './PageLoader';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // 2. Add state to track if loading is happening
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        // 3. Start the loading animation immediately when button is clicked
        setIsLoading(true);

        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // 4. Login successful! Wait 2 seconds to show off the animation before redirecting.
            setTimeout(() => {
                 navigate('/'); 
            }, 2000);

        } catch (error) {
            // 5. If there is an error, stop loading immediately so they can try again
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
            {/* 6. Conditionally show the loader IF isLoading is true */}
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
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isLoading} // Disable input while loading
                            />
                        </div>

                        {error && <p style={{color: '#ff4444', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {/* Change button text while loading */}
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
