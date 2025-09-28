const mongoose = require('mongoose');

// Define the schema for the Chat document
const chatSchema = new mongoose.Schema({
  sender_usc_id: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/, // 10-digit usc_id
    ref: 'User' // This references the sender in the User collection
  },
  receiver_usc_id: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/, // 10-digit usc_id
    ref: 'User' // This references the receiver in the User collection
  },
  message: { 
    type: String, 
    required: true 
  },
  message_type: { 
    type: String, 
    enum: ['text', 'image', 'file'], // Could be extended to support other types of messages
    default: 'text'
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'],
    default: 'sent' // Status of the message
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema, 'chat');

module.exports = Chat;
