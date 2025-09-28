import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import './User.css';

const User = () => {
  const [isEditing, setIsEditing] = useState({
    major: false,
    classes: false,
    interests: false
  });

  const [profile, setProfile] = useState({
    name: "Loading...",
    year: "Loading...",
    major: "Loading...",
    classes: [],
    interests: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userUscId = user.usc_id || '1234567890'; // fallback

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch current user details
      const response = await fetch(`${API_BASE_URL}/api/users/get-current-user?usc_id=${userUscId}`);
      if (response.ok) {
        const userData = await response.json();
        
        // Transform backend data to frontend format
        setProfile({
          name: `${userData.firstname || userData.first_name || ''} ${userData.lastname || userData.last_name || ''}`.trim(),
          year: userData.current_year || 'Unknown',
          major: userData.dept || 'Unknown',
          classes: Array.isArray(userData.classes) ? userData.classes : [],
          interests: Array.isArray(userData.interests) ? userData.interests : []
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async (field) => {
    try {
      setSaving(true);
      
      // Prepare update data
      const updateData = {
        usc_id: userUscId
      };

      // Map frontend fields to backend fields
      if (field === 'major') {
        updateData.dept = profile.major;
      } else if (field === 'classes') {
        updateData.classes = profile.classes;
      } else if (field === 'interests') {
        updateData.interests = profile.interests;
      }

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated:', result);
        setIsEditing(prev => ({ ...prev, [field]: false }));
        alert(`${field} updated successfully!`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="user-container">
        <Navbar />
        <div className="user-content">
          <LoadingSpinner message="Loading your profile..." />
        </div>
        <Footer />
      </div>
    );
  }

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
                <button 
                  onClick={() => handleSave('major')} 
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
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
                <button 
                  onClick={() => handleSave('classes')} 
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
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
                <button 
                  onClick={() => handleSave('interests')} 
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
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
