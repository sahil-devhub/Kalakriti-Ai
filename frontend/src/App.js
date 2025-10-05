import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// --- FIX: Corrected the import paths to match your file structure ---
import HomePage from './HomePage';
import SignupPage from './SignupPage';
// --------------------------------------------------------------------
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="background-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

