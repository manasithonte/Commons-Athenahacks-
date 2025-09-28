import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './User.css';

const User = () => {
  const [isEditing, setIsEditing] = useState({
    major: false,
    classes: false,
    interests: false
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    year: "Junior",
    major: "Computer Science",
    classes: ["CS 101", "MATH 240", "PHYS 201"],
    interests: ["Programming", "Machine Learning", "Web Development"]
  });

  const handleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    if (field === 'classes' || field === 'interests') {
      // Split by commas and trim whitespace
      const items = value.split(',').map(item => item.trim());
      setProfile(prev => ({ ...prev, [field]: items }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="user-container">
      <Navbar />
      <div className="user-content">
        <div className="profile-header">
          <div className="profile-image">
            <div className="placeholder-image"></div>
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="year">{profile.year}</p>
          </div>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <div className="section-header">
              <h2>Major</h2>
              {!isEditing.major ? (
                <button onClick={() => handleEdit('major')} className="edit-btn">Edit</button>
              ) : (
                <button onClick={() => handleSave('major')} className="save-btn">Save</button>
              )}
            </div>
            {isEditing.major ? (
              <input
                type="text"
                value={profile.major}
                onChange={(e) => handleChange('major', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{profile.major}</p>
            )}
          </section>

          <section className="profile-section">
            <div className="section-header">
              <h2>Classes This Semester</h2>
              {!isEditing.classes ? (
                <button onClick={() => handleEdit('classes')} className="edit-btn">Edit</button>
              ) : (
                <button onClick={() => handleSave('classes')} className="save-btn">Save</button>
              )}
            </div>
            {isEditing.classes ? (
              <input
                type="text"
                value={profile.classes.join(', ')}
                onChange={(e) => handleChange('classes', e.target.value)}
                placeholder="Enter classes separated by commas"
                className="edit-input"
              />
            ) : (
              <div className="tags">
                {profile.classes.map((className, index) => (
                  <span key={index} className="tag">{className}</span>
                ))}
              </div>
            )}
          </section>

          <section className="profile-section">
            <div className="section-header">
              <h2>Interests</h2>
              {!isEditing.interests ? (
                <button onClick={() => handleEdit('interests')} className="edit-btn">Edit</button>
              ) : (
                <button onClick={() => handleSave('interests')} className="save-btn">Save</button>
              )}
            </div>
            {isEditing.interests ? (
              <input
                type="text"
                value={profile.interests.join(', ')}
                onChange={(e) => handleChange('interests', e.target.value)}
                placeholder="Enter interests separated by commas"
                className="edit-input"
              />
            ) : (
              <div className="tags">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="tag">{interest}</span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default User;
