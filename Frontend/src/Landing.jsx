import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import "./Landing.css";

const Landing = () => {
  // const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    major: "",
    classes: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   navigate('/home');
  // };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
  
    const endpoint = isLogin ? `${API_BASE_URL}/api/users/login` : `${API_BASE_URL}/api/users/save-profile`;
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      console.log("Success:", data);
  
      if (isLogin) {
        alert("Login Successful!");
        // Store JWT or session data if needed
      } else {
        alert("Profile Created!");
      }
  
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className={`landing-content ${isLogin ? 'login-mode' : 'signup-mode'}`}>
      {/* Left Side - Branding & Welcome */}
      <div className="landing-left">
        <div className="logo-container">
          <img src="img/logo.png" alt="Commons Logo" className="commons-logo" />
        </div>
        <p className="brand-description">
          Connect with students in your major, find study partners, and build your academic network!
        </p>
        <div className="auth-toggle">
          <button
            className={`auth-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <button
            className={`auth-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="landing-right">
        <div className="auth-form-container">
          <h2>{isLogin ? 'Welcome Back!' : 'Create Your Profile'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className={`form-group ${isLogin ? 'hidden' : ''}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
                disabled={isLogin}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className={`form-group ${isLogin ? 'hidden' : ''}`}>
              <label>Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Enter your major"
                required={!isLogin}
                disabled={isLogin}
              />
            </div>

            <div className={`form-group ${isLogin ? 'hidden' : ''}`}>
              <label>Classes</label>
              <input
                type="text"
                name="classes"
                value={formData.classes}
                onChange={handleChange}
                placeholder="Enter your current classes"
                required={!isLogin}
                disabled={isLogin}
              />
            </div>

            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Landing;
