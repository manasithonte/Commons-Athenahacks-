import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import './Home.css';

const Home = () => {
  const [filters, setFilters] = useState({
    department: 'All Departments',
    class: 'All Classes',
    mentor: false
  });

  const [topRecommendations, setTopRecommendations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userUscId = user.usc_id || '1234567890'; // fallback

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const handleSendFriendRequest = async (targetUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/send-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usc_id: userUscId,
          matching_id: targetUser.usc_id || targetUser.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Friend request sent:', result);
        alert('Friend request sent successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Error sending friend request. Please try again.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      // Fetch recommendations
      if (userId) {
        const recommendationsResponse = await fetch(`${API_BASE_URL}/api/users/recommend-buddies?user_id=${userId}`);
        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          setTopRecommendations(recommendationsData.recommendations || []);
        }
      }

      // Fetch all users
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/get-all-users`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setAllUsers(usersData);
        setFilteredUsers(usersData);
      }

      // Fetch departments
      const deptResponse = await fetch(`${API_BASE_URL}/api/users/get_dep`);
      if (deptResponse.ok) {
        const deptData = await deptResponse.json();
        setDepartments(['All Departments', ...deptData]);
      }

      // Fetch courses
      const coursesResponse = await fetch(`${API_BASE_URL}/api/users/get_courses`);
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(['All Classes', ...coursesData.slice(0, 20)]); // Limit for UI
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for top recommendations (fallback)
  const mockTopRecommendations = [
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

  // Transform backend data to match frontend format
  const transformUserData = (user) => ({
    id: user._id,
    name: `${user.firstname || user.first_name || ''} ${user.lastname || user.last_name || ''}`.trim(),
    year: user.current_year || 'Unknown',
    major: [user.dept || 'Unknown'],
    classes: Array.isArray(user.classes) ? user.classes.join(', ') : (user.classes || 'Unknown'),
    interests: Array.isArray(user.interests) ? user.interests : [user.interests || 'Unknown'],
    image: "img/user.png",
    isMentor: user.mentor === 'Yes' || user.mentor === 'true' || user.mentor === true
  });

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
      <button 
        className="add-common-btn"
        onClick={() => handleSendFriendRequest(user)}
      >
        REQUEST
      </button>
    </div>
  );

  const handleFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    const filtered = allUsers.filter(user => {
      const transformedUser = transformUserData(user);
      if (newFilters.mentor && !transformedUser.isMentor) return false;
      if (newFilters.department !== "All Departments" && 
          !transformedUser.major.some(m => m.toUpperCase() === newFilters.department.toUpperCase())) return false;
      if (newFilters.class !== "All Classes" && !transformedUser.classes.includes(newFilters.class)) return false;
      return true;
    });
    
    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <main className="main-content">
          <LoadingSpinner message="Finding your perfect study buddies..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <div className="top-recommendations">
          <h1 className="section-title">YOUR TOP COMMONS....</h1>
          <p className="section-subtitle">based on your profile</p>
          <div className="commons-grid">
            {(topRecommendations.length > 0 ? topRecommendations.map(transformUserData) : mockTopRecommendations).map((user, index) => (
              <CommonCard key={index} user={user} />
            ))}
          </div>
        </div>

        <div 
          className="section-divider" 
          onClick={() => setShowMore(!showMore)}
          style={{ cursor: 'pointer' }}
        >
          {showMore ? 'see less' : 'see more'}
        </div>

        {showMore && (
        <div className="filter-section">
          <aside className="filter-sidebar">
            <h2 className="filter-title">FILTER BY:</h2>
            <div className="filter-group">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  checked={filters.mentor} 
                  onChange={(e) => handleFilter('mentor', e.target.checked)}
                />
                mentor
              </label>
            </div>
            <div className="filter-group">
              <h3>department</h3>
              <select 
                className="filter-select"
                value={filters.department}
                onChange={(e) => handleFilter('department', e.target.value)}
              >
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <h3>classes</h3>
              <select 
                className="filter-select"
                value={filters.class}
                onChange={(e) => handleFilter('class', e.target.value)}
              >
                {courses.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>
          </aside>

          <div className="filter-content">
            <div className="commons-grid">
              {filteredUsers.map((user, index) => (
                <CommonCard key={index} user={transformUserData(user)} />
              ))}
            </div>
          </div>
        </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
