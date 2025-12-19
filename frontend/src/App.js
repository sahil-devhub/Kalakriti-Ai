import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage'; // <--- 1. Import the new page
import ForgotPassword from './ForgotPassword'; // <--- 1. Import this
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
          <Link to="/login" className="nav-link">Login</Link>   {/* <--- 2. Add Login Link */}
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />       {/* <--- 3. Add Login Route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
