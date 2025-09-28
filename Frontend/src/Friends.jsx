import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import './Friends.css';

const Friends = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [friends, setFriends] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userUscId = user.usc_id || '1234567890'; // fallback

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      console.log('Fetching friends for user:', userUscId);
      
      // Fetch friends list
      const friendsResponse = await fetch(`${API_BASE_URL}/api/users/get-friends?usc_id=${userUscId}`);
      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json();
        console.log('Friends data:', friendsData);
        setFriends(friendsData);
      } else {
        console.error('Friends response not ok:', friendsResponse.status);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (friendUscId) => {
    try {
      console.log('Fetching chat history between:', userUscId, 'and', friendUscId);
      const chatResponse = await fetch(`${API_BASE_URL}/api/users/get-chat-history?usc_id1=${userUscId}&usc_id2=${friendUscId}`);
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        console.log('Raw chat data:', chatData);
        const transformedMessages = (chatData.chatHistory || []).map(message => ({
          id: message._id,
          sender: message.sender_usc_id === userUscId ? 'You' : 'Friend',
          text: message.message,
          time: new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        console.log('Transformed messages:', transformedMessages);
        setChatHistory(transformedMessages);
      } else {
        console.error('Chat response not ok:', chatResponse.status);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Mock data for friends (fallback)
  const mockFriends = [
    {
      id: 1,
      name: "Sarah Chen",
      major: "Computer Science",
      lastMessage: "See you in class tomorrow!",
      messages: [
        { id: 1, sender: "Sarah", text: "Hey! Want to study together for the midterm?", time: "2:30 PM" },
        { id: 2, sender: "You", text: "Sure! When are you free?", time: "2:35 PM" },
        { id: 3, sender: "Sarah", text: "How about tomorrow at 3?", time: "2:36 PM" },
        { id: 4, sender: "You", text: "Perfect! Library?", time: "2:40 PM" },
        { id: 5, sender: "Sarah", text: "See you in class tomorrow!", time: "2:41 PM" }
      ]
    },
    {
      id: 2,
      name: "Mike Johnson",
      major: "Biology",
      lastMessage: "Thanks for the notes!",
      messages: [
        { id: 1, sender: "Mike", text: "Could you share today's lecture notes?", time: "11:20 AM" },
        { id: 2, sender: "You", text: "Just sent them!", time: "11:45 AM" },
        { id: 3, sender: "Mike", text: "Thanks for the notes!", time: "11:46 AM" }
      ]
    }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedFriend) return;

    try {
      // Send message to backend
      const response = await fetch(`${API_BASE_URL}/api/users/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_usc_id: userUscId,
          receiver_usc_id: selectedFriend.usc_id,
          message: messageInput,
          message_type: 'text'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent:', result);
        
        // Add to local state for immediate display
        const newMessage = {
          id: Date.now(),
          sender: 'You',
          text: messageInput,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setChatHistory(prev => [...prev, newMessage]);
        setMessageInput('');
        
        // Refresh chat history to get the latest messages
        if (selectedFriend && selectedFriend.usc_id) {
          setTimeout(() => {
            fetchChatHistory(selectedFriend.usc_id);
          }, 500);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const handleFriendSelect = (friend) => {
    console.log('Selected friend:', friend);
    setSelectedFriend(friend);
    // Fetch chat history for this friend
    if (friend.usc_id) {
      console.log('Fetching chat history for:', friend.usc_id);
      fetchChatHistory(friend.usc_id);
    }
  };

  // Transform backend friend data
  const transformFriendData = (friend) => ({
    id: friend._id,
    name: `${friend.firstname || friend.first_name || ''} ${friend.lastname || friend.last_name || ''}`.trim(),
    major: friend.dept || 'Unknown',
    lastMessage: "Click to start chatting",
    usc_id: friend.usc_id,
    messages: [] // Will be loaded when selected
  });

  if (loading) {
    return (
      <div className="friends-container">
        <Navbar />
        <div className="friends-content">
          <LoadingSpinner message="Loading your connections..." />
        </div>
        <Footer />
      </div>
    );
  }

  const displayFriends = friends.length > 0 ? friends.map(transformFriendData) : mockFriends;

  return (
    <div className="friends-container">
      <Navbar />
      <div className="friends-content">
        <div className="friends-list">
          <h2>My Commons</h2>
          {displayFriends.map(friend => (
            <div
              key={friend.id}
              className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
              onClick={() => handleFriendSelect(friend)}
            >
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p className="friend-major">{friend.major}</p>
                <p className="last-message">{friend.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-section">
          {selectedFriend ? (
            <>
              <div className="chat-header">
                <h3>{selectedFriend.name}</h3>
                <p>{selectedFriend.major}</p>
              </div>
              
              <div className="messages-container">
                {console.log('Rendering chat history:', chatHistory)}
                {chatHistory.length > 0 ? (
                  chatHistory.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">{message.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a friend to start chatting</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Friends; 