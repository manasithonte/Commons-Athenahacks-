import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Friends.css';

const Friends = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock data for friends
  const friends = [
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // In a real app, this would send the message to a backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  return (
    <div className="friends-container">
      <Navbar />
      <div className="friends-content">
        <div className="friends-list">
          <h2>My Commons</h2>
          {friends.map(friend => (
            <div
              key={friend.id}
              className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
              onClick={() => setSelectedFriend(friend)}
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
                {selectedFriend.messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-time">{message.time}</span>
                    </div>
                  </div>
                ))}
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