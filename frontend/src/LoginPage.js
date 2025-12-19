// src/LoginPage.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // <--- IMPORT THE NEW CSS FILE HERE

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); 
        } catch (error) {
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
                        />
                    </div>

                    {error && <p style={{color: '#ff4444', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

                    <button type="submit" className="submit-btn">
                        Login
                    </button>
                </form>

                <p style={{marginTop: '20px', textAlign: 'center', color: '#94a3b8'}}>
                    Don't have an account? <Link to="/signup" style={{color: '#c084fc', fontWeight: 'bold', textDecoration: 'none'}}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;