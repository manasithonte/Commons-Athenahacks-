const mongoose = require('mongoose');

// Define the schema for the Friends document
const friendsSchema = new mongoose.Schema({
  usc_id: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/, // 10-digit usc_id
    ref: 'User' // This creates a reference to the 'User' collection for the usc_id
  },
  matching_id: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/, // 10-digit m_id
    ref: 'User' // This creates a reference to the 'User' collection for the matching_id (foreign key)
  },
  status: { 
    type: Number, 
    required: true, 
    enum: [0, 1], // 0 or 1 flag
    default: 0 // 0 can represent 'pending', 1 can represent 'friends'
  }
}, { timestamps: false });

// Ensure the combination of usc_id and matching_id is unique
friendsSchema.index({ usc_id: 1, matching_id: 1 }, { unique: true });

const Friend = mongoose.model('Friend', friendsSchema);

module.exports = Friend;
