import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
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
    
    // Prepare data based on whether it's login or registration
    let requestData;
    if (isLogin) {
      // For login, only send email and password
      requestData = {
        email: formData.email,
        password: formData.password
      };
    } else {
      // For registration, send all required fields
      requestData = {
        firstname: formData.name.split(' ')[0] || '',
        lastname: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        password: formData.password,
        dept: formData.major,
        classes: formData.classes ? formData.classes.split(',').map(c => c.trim()) : [],
        mentor: "false",
        current_year: "Junior", // You might want to add this to the form
        interests: [], // You might want to add this to the form
        usc_id: "1234567890" // You need to add USC ID field to the form
      };
    }
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      console.log("Success:", data);
  
      if (isLogin) {
        alert("Login Successful!");
        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Navigate to home page
        navigate('/home');
      } else {
        alert("Profile Created!");
        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Navigate to home page
        navigate('/home');
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
