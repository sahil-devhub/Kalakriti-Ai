/* src/LoginPage.css */

/* Center the card on the page */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
  animation: fadeIn 0.8s ease-out;
}

/* The Glass Card Design */
.login-card {
  background: rgba(10, 10, 26, 0.6); /* Semi-transparent dark background */
  backdrop-filter: blur(12px);         /* Blur effect behind the card */
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3); /* Thin purple border */
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.15), /* Outer glow */
              inset 0 0 20px rgba(139, 92, 246, 0.05); /* Inner glow */
  width: 100%;
  max-width: 420px;
  text-align: left;
  position: relative;
  overflow: hidden;
}

/* Optional: Top glow line */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ec4899, #8b5cf6, transparent);
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.login-subtitle {
  color: #a5b4fc;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #e0e7ff;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box; /* Ensures padding doesn't break width */
}

.form-input:focus {
  border-color: #8b5cf6;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.form-input::placeholder {
  color: #6b7280;
}

/* Button Style */
.submit-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: linear-gradient(90deg, #ec4899, #8b5cf6);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
