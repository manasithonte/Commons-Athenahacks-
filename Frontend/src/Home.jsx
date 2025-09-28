import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';

const Home = () => {
  const [filters, setFilters] = useState({
    department: 'All Departments',
    class: 'All Classes',
    mentor: false
  });

  // Mock departments and classes for filters
  const availableDepartments = ["All Departments", "Neuroscience", "Global Health", "Computer Science", "Business", "Psychology"];
  const availableClasses = ["All Classes", "BISC 408", "CSCI 401", "PSYC 355", "BUAD 302"];

  // Mock data for top recommendations
  const topRecommendations = [
    {
      name: "ANAAYA MEHRA",
      year: "Senior",
      major: ["NEUROSCIENCE", "GLOBAL HEALTH"],
      classes: "BISC 408",
      interests: ["Concerts", "Eating out", "Road trips"],
      image: "img/user.png",
      isMentor: false
    },
    {
      name: "ANAAYA MEHRA",
      year: "Senior",
      major: ["NEUROSCIENCE", "GLOBAL HEALTH"],
      classes: "BISC 408",
      interests: ["Concerts", "Eating out", "Road trips"],
      image: "img/user.png",
      isMentor: true
    },
    {
      name: "ANAAYA MEHRA",
      year: "Senior",
      major: ["NEUROSCIENCE", "GLOBAL HEALTH"],
      classes: "BISC 408",
      interests: ["Concerts", "Eating out", "Road trips"],
      image: "img/user.png",
      isMentor: false
    }
  ];

  // Mock data for other users
  const otherUsers = [
    {
      name: "Sarah Chen",
      year: "Junior",
      major: ["COMPUTER SCIENCE"],
      classes: "CSCI 401",
      interests: ["Coding", "Gaming", "Coffee"],
      image: "img/user.png",
      isMentor: true
    },
    {
      name: "Michael Park",
      year: "Senior",
      major: ["BUSINESS", "PSYCHOLOGY"],
      classes: "BUAD 302",
      interests: ["Startups", "Reading", "Tennis"],
      image: "img/user.png",
      isMentor: false
    },
    {
      name: "Emily Rodriguez",
      year: "Sophomore",
      major: ["PSYCHOLOGY"],
      classes: "PSYC 355",
      interests: ["Research", "Hiking", "Photography"],
      image: "img/user.png",
      isMentor: true
    },
    {
      name: "James Wilson",
      year: "Junior",
      major: ["GLOBAL HEALTH"],
      classes: "BISC 408",
      interests: ["Volunteering", "Travel", "Music"],
      image: "img/user.png",
      isMentor: false
    },
    {
      name: "Sophia Kim",
      year: "Senior",
      major: ["COMPUTER SCIENCE", "PSYCHOLOGY"],
      classes: "CSCI 401",
      interests: ["AI", "Art", "Running"],
      image: "img/user.png",
      isMentor: true
    },
    {
      name: "David Thompson",
      year: "Junior",
      major: ["NEUROSCIENCE"],
      classes: "BISC 408",
      interests: ["Research", "Basketball", "Cooking"],
      image: "img/user.png",
      isMentor: false
    }
  ];

  const CommonCard = ({ user }) => (
    <div className={`commons-card ${user.isMentor ? 'mentor-card' : ''}`}>
      <div className="card-header">
        <img 
          src={user.image} 
          alt={user.name} 
          className="profile-image"
        />
        <span className="year-tag">{user.year}</span>
      </div>
      <div className="profile-info">
        <h3 className="profile-name">{user.name}</h3>
        <div className="tags-container">
          {user.major.map((major, index) => (
            <span key={index} className="tag">{major}</span>
          ))}
        </div>
        <div className="profile-details">
          <p className="profile-detail">
            <strong>Classes:</strong> {user.classes}
          </p>
          <p className="profile-detail">
            <strong>Interests:</strong> {user.interests.join(", ")}
          </p>
        </div>
      </div>
      <button className="add-common-btn">REQUEST</button>
    </div>
  );

  const handleFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    return otherUsers.filter(user => {
      if (newFilters.mentor && !user.isMentor) return false;
      if (newFilters.department !== "All Departments" && 
          !user.major.some(m => m.toUpperCase() === newFilters.department.toUpperCase())) return false;
      if (newFilters.class !== "All Classes" && user.classes !== newFilters.class) return false;
      return true;
    });
  };

  const [filteredUsers, setFilteredUsers] = useState(otherUsers);

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <div className="top-recommendations">
          <h1 className="section-title">YOUR TOP COMMONS....</h1>
          <p className="section-subtitle">based on your profile</p>
          <div className="commons-grid">
            {topRecommendations.map((user, index) => (
              <CommonCard key={index} user={user} />
            ))}
          </div>
        </div>

        <div className="section-divider">see more</div>

        <div className="filter-section">
          <aside className="filter-sidebar">
            <h2 className="filter-title">FILTER BY:</h2>
            <div className="filter-group">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  checked={filters.mentor} 
                  onChange={(e) => setFilteredUsers(handleFilter('mentor', e.target.checked))}
                />
                mentor
              </label>
            </div>
            <div className="filter-group">
              <h3>department</h3>
              <select 
                className="filter-select"
                value={filters.department}
                onChange={(e) => setFilteredUsers(handleFilter('department', e.target.value))}
              >
                {availableDepartments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <h3>classes</h3>
              <select 
                className="filter-select"
                value={filters.class}
                onChange={(e) => setFilteredUsers(handleFilter('class', e.target.value))}
              >
                {availableClasses.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>
          </aside>

          <div className="filter-content">
            <div className="commons-grid">
              {filteredUsers.map((user, index) => (
                <CommonCard key={index} user={user} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
