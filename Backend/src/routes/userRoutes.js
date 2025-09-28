// Signup Route - Only USC Emails Allowed
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users"); // Assuming the User model is stored in this location
const Friend = require('../models/friends'); // Assuming the Friend model is in a 'models' directory
const authMiddleware = require("../middleware/auth");
const { getStudyBuddyRecommendations } = require("../utils/matchingEngine");
const Chat = require('../models/chat'); 

router.post(
  "/save-profile",
  [
    check("firstname", "First name is required").not().isEmpty(),
    check("lastname", "Last name is required").not().isEmpty(),
    check("email", "Invalid USC email").matches(/^[a-zA-Z0-9._%+-]+@usc\.edu$/),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("usc_id", "USC ID must be a 10 digit number").matches(/^[0-9]{10}$/),
    check("classes", "At least one class is required").isArray().notEmpty(),
    check("interests", "At least one interest is required").isArray().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password, dept, classes, mentor, current_year, interests, usc_id } = req.body;

    try {
      // Check if the user already exists by email or usc_id
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists with this email" });
      }

      // Check if the USC ID already exists
      user = await User.findOne({ usc_id });
      if (user) {
        return res.status(400).json({ msg: "User already exists with this USC ID" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        dept,
        classes,
        mentor,
        current_year,
        interests,
        usc_id
      });

      await user.save();

      // Generate JWT Token
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

      // Send the token in the response
      res.json({ token });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    check("email", "Invalid USC email").matches(/^[a-zA-Z0-9._%+-]+@usc\.edu$/),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT Token
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          firstname: user.firstname || user.first_name, 
          lastname: user.lastname || user.last_name 
        } 
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// GET all friends for the friends page
// Import the necessary models

// GET friends for a given usc_id with status = 1 (accepted friends)
router.get("/get-friends", async (req, res) => {
  try {
    console.log("req: ", req.query)
    const { usc_id } = req.query; // Get the usc_id from the query parameters

    if (!usc_id) {
      return res.status(400).json({ error: "USC ID is required" });
    }

    // Find all friends with the given usc_id and status = 1 (friends)
    const friends = await Friend.find({
      $or: [
        { usc_id: usc_id, status: 1 },
        { matching_id: usc_id, status: 1 }
      ]
    });

    // Extract matching IDs from the friends list
    const matchingIds = friends.map(friend => 
      friend.usc_id === usc_id ? friend.matching_id : friend.usc_id
    );

    // Query the User collection for matching users
    const users = await User.find({
      usc_id: { $in: matchingIds }
    });

    // Return the user information
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET departments
router.get("/get_dep", (req, res) => {
  // Define the list of departments
  const departments = [
    "Computer Science",
    "Data Science",
    "Biomedical Engineering",
    "Information Technology Program",
    "Electrical Engineering"
  ];

  // Return the list of departments
  res.json(departments);
});

// GET courses
router.get("/get_courses", (req, res) => {
  // Define the list of courses
  const courses = [
    "CSCI-102L", "CSCI-103L", "CSCI-104L", "CSCI-170", "CSCI-201", "CSCI-270", "CSCI-299",
    "CSCI-310", "CSCI-350", "CSCI-353", "CSCI-356", "CSCI-360", "CSCI-368", "CSCI-380",
    "CSCI-401", "CSCI-402", "CSCI-420", "CSCI-426", "CSCI-430", "CSCI-435", "CSCI-450",
    "CSCI-455x", "CSCI-457", "CSCI-458", "CSCI-467", "CSCI-475", "CSCI-487", "CSCI-490x",
    "CSCI-491bL", "CSCI-495", "CSCI-501", "CSCI-502b", "CSCI-505b", "CSCI-517", "CSCI-520",
    "CSCI-522", "CSCI-526", "CSCI-529b", "CSCI-531", "CSCI-532", "CSCI-533", "CSCI-534",
    "CSCI-535", "CSCI-544", "CSCI-550", "CSCI-555L", "CSCI-557", "CSCI-559", "CSCI-561",
    "CSCI-563", "CSCI-566", "CSCI-567", "CSCI-568", "CSCI-570", "CSCI-571", "CSCI-572",
    "CSCI-576", "CSCI-577a", "CSCI-580", "CSCI-585", "CSCI-587", "CSCI-590", "CSCI-591",
    "CSCI-594a", "CSCI-594b", "CSCI-594z", "CSCI-599", "CSCI-625", "CSCI-644", "CSCI-649",
    "CSCI-655", "CSCI-658", "CSCI-670", "CSCI-673", "CSCI-677", "CSCI-697", "CSCI-698",
    "CSCI-699", "CSCI-790", "CSCI-794a", "CSCI-794b", "CSCI-794c", "CSCI-794d", "CSCI-794z",
    "DSCI-351", "DSCI-454", "DSCI-510", "DSCI-517", "DSCI-525", "DSCI-529", "DSCI-531",
    "DSCI-549", "DSCI-550", "DSCI-551", "DSCI-552", "DSCI-553", "DSCI-554", "DSCI-556",
    "DSCI-558", "DSCI-560", "DSCI-561", "DSCI-563", "DSCI-590", "DSCI-599",
    "BME-101", "BME-201", "BME-210", "BME-308", "BME-403L", "BME-405L", "BME-408",
    "BME-410L", "BME-412", "BME-427", "BME-450", "BME-490x", "BME-499", "BME-501",
    "BME-505bL", "BME-506", "BME-513", "BME-514", "BME-515", "BME-525", "BME-528",
    "BME-530", "BME-533", "BME-552", "BME-555aL", "BME-590", "BME-594a", "BME-594b",
    "BME-594z", "BME-599", "BME-790", "BME-794a", "BME-794b", "BME-794c", "BME-794d",
    "BME-794z", "ITP-101", "ITP-104", "ITP-115", "ITP-116", "ITP-124", "ITP-125L",
    "ITP-165", "ITP-168", "ITP-190", "ITP-215L", "ITP-216", "ITP-249", "ITP-256",
    "ITP-259", "ITP-265", "ITP-301", "ITP-303", "ITP-304", "ITP-308", "ITP-310",
    "ITP-320", "ITP-325", "ITP-342", "ITP-348", "ITP-349", "ITP-351", "ITP-357",
    "ITP-359", "ITP-361", "ITP-365", "ITP-366", "ITP-368", "ITP-370", "ITP-375",
    "ITP-380", "ITP-383", "ITP-388", "ITP-393", "ITP-405", "ITP-419", "ITP-425",
    "ITP-435", "ITP-449", "ITP-456", "ITP-457", "ITP-459", "ITP-466", "ITP-470",
    "ITP-471", "ITP-475", "ITP-476", "ITP-479", "ITP-480", "ITP-481", "ITP-485",
    "ITP-499", "EE-105", "EE-109L", "EE-202L", "EE-250L", "EE-301", "EE-338",
    "EE-354L", "EE-355x", "EE-364", "EE-415", "EE-434Lx", "EE-436", "EE-443",
    "EE-447Lx", "EE-450", "EE-455x", "EE-457", "EE-459Lx", "EE-460", "EE-467",
    "EE-477L", "EE-481l", "EE-483", "EE-490x", "EE-494a", "EE-494b", "EE-501",
    "EE-503", "EE-508", "EE-510", "EE-512", "EE-518", "EE-521", "EE-522", "EE-523",
    "EE-526", "EE-528", "EE-529", "EE-533", "EE-535", "EE-538", "EE-541", "EE-543",
    "EE-547", "EE-549", "EE-552", "EE-557", "EE-559", "EE-561", "EE-562", "EE-563",
    "EE-564", "EE-569", "EE-570a", "EE-576", "EE-577a", "EE-577b", "EE-578", "EE-587",
    "EE-590", "EE-594a", "EE-594b", "EE-594z", "EE-597", "EE-599", "EE-607", "EE-626",
    "EE-631", "EE-632a", "EE-641", "EE-658", "EE-676", "EE-690", "EE-790", "EE-794a",
    "EE-794b", "EE-794c", "EE-794d", "EE-794z"
  ];

  // Return the list of courses
  res.json(courses);
});


// POST /connect_friend - Update status to 1 for a specific friend connection
router.post("/connect_friend", async (req, res) => {
  try {
    const { usc_id, matching_id } = req.body;

    // Validate input
    if (!usc_id || !matching_id) {
      return res.status(400).json({ message: "usc_id and matching_id are required." });
    }

    // Try to find the friend request in both possible orderings
    let friendExists = await Friend.findOne({
      $or: [
        { usc_id: usc_id, matching_id: matching_id },
        { usc_id: matching_id, matching_id: usc_id }
      ]
    });

    if (!friendExists) {
      return res.status(404).json({ message: "Friend connection not found in any order." });
    }

    if (friendExists.status === 1) {
      return res.status(400).json({ message: "Already friends." });
    }

    // Update the status from 0 to 1
    const updatedFriend = await Friend.findOneAndUpdate(
      { _id: friendExists._id, status: 0 }, // Ensure status is 0 before updating
      { $set: { status: 1 } },
      { new: true }
    );

    if (!updatedFriend) {
      return res.status(400).json({ message: "Friend request exists, but status was not 0." });
    }

    res.json({ message: "Friend connection updated successfully.", friend: updatedFriend });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// GET pending friends for a given usc_id (status = 0)
router.get("/get-pending-friends", async (req, res) => {
  try {
    const { usc_id } = req.query; // Get the usc_id from the query parameters

    if (!usc_id) {
      return res.status(400).json({ error: "USC ID is required" });
    }

    // Find all pending friend requests (status = 0)
    console.log("Querying for pending friends with usc_id:", usc_id);
    const pendingFriends = await Friend.find({
      $or: [
        { usc_id: String(usc_id), status: 0 },
        { matching_id: String(usc_id), status: 0 }
      ]
    });
    console.log("Pending friends found:", pendingFriends);

    if (!pendingFriends.length) {
      return res.status(404).json({ error: "No pending friends found" });
    }

    // Extract matching IDs from the pending friends list
    const matchingIds = pendingFriends.map(friend =>
      friend.usc_id === usc_id ? friend.matching_id : friend.usc_id
    );

    // Query the User collection for pending friend user details
    const users = await User.find({
      usc_id: { $in: matchingIds }
    });

    if (!users.length) {
      return res.status(404).json({ error: "No users found for the pending friend requests" });
    }

    console.log("Received matching:", matchingIds);

    // Return the user information
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET ALL PRESENT USER RECORDS
// TO DO: INCORPORATE FILTERS FOR SEARCHING, get a flag from UI
router.get("/get-all-users",  async (req, res) => {
    try {
      const filter = {};
  
      // Apply filters if provided in the query parameters (not body for GET)
      if (req.query.dept) {
        filter.dept = req.query.dept;
      }
      if (req.query.mentor) {
        filter.mentor = req.query.mentor;
      }
      if (req.query.current_year) {
        filter.current_year = req.query.current_year;
      }
      if (req.query.classes) {
        filter.classes = { $in: req.query.classes.split(',') }; 
      }
      if (req.query.interests) {
        filter.interests = { $in: req.query.interests.split(',') }; 
      }
  
      const users = await User.find(filter).select('-password'); // Exclude passwords
  
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found matching the criteria." });
      }
  
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  });


// GET CURRENT USER DETAILS
// router.get("/get-current-user", authMiddleware, async (req, res) => {
router.get("/get-current-user",  async (req, res) => {
    try {
    // For now, get user by USC ID from query params (temporary fix)
    const { usc_id } = req.query;
    
    if (!usc_id) {
      return res.status(400).json({ error: "USC ID is required" });
    }
    
    // Fetch user & exclude password
    const user = await User.findOne({ usc_id }).select("-password"); 
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });


// GET RECOMMENDATIONS
// router.get("/recommend-buddies", authMiddleware, async (req, res) => {
router.get("/recommend-buddies",  async (req, res) => {
    try {
    // For now, get user ID from query params (temporary fix)
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const recommendations = await getStudyBuddyRecommendations(user_id);
    res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study buddy recommendations" });
    }
  });


// CHAT
router.get("/get-chat-history", async (req, res) => {
  try {
    console.log("req: ", req.query);
    const { usc_id1, usc_id2 } = req.query; // Get the two USC IDs from the query parameters

    console.log("Received USC IDs:", usc_id1, usc_id2);

    if (!usc_id1 || !usc_id2) {
      console.log("Error: Missing USC IDs");
      return res.status(400).json({ error: "Both USC IDs are required" });
    }

    console.log("Fetching chat history from the database...");
    console.log("TYPE : ", typeof(usc_id1));

    // Retrieve chat history using the Chat model
    const chatHistory = await Chat.find({
      $or: [
        { sender_usc_id: usc_id1, receiver_usc_id: usc_id2 },
        { sender_usc_id: usc_id2, receiver_usc_id: usc_id1 }
      ]
    })
      .sort({ timestamp: 1 }) // Sort by timestamp, ascending
      .limit(100) // Optional: Limit the number of results
      .exec();


    console.log("Chat history retrieved:", chatHistory);

    if (chatHistory.length === 0) {
      console.log("No chat history found for the provided USC IDs.");
      return res.json({ chatHistory: [] }); // Return empty array instead of error
    }

    // Return the chat history
    console.log("Sending chat history response...");
    res.json({ chatHistory });
  } catch (err) {
    console.error("Error occurred while retrieving chat history:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /send-friend-request - Send a friend request
router.post("/send-friend-request", async (req, res) => {
  try {
    const { usc_id, matching_id } = req.body;

    // Validate input
    if (!usc_id || !matching_id) {
      return res.status(400).json({ message: "usc_id and matching_id are required." });
    }

    // Check if users exist
    const user1 = await User.findOne({ usc_id });
    const user2 = await User.findOne({ usc_id: matching_id });

    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    // Check if friend request already exists
    const existingRequest = await Friend.findOne({
      $or: [
        { usc_id: usc_id, matching_id: matching_id },
        { usc_id: matching_id, matching_id: usc_id }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists." });
    }

    // Create friend request
    const friendRequest = new Friend({
      usc_id,
      matching_id,
      status: 0 // pending
    });

    await friendRequest.save();

    res.json({ message: "Friend request sent successfully.", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// POST /send-message - Send a message
router.post("/send-message", async (req, res) => {
  try {
    const { sender_usc_id, receiver_usc_id, message, message_type = 'text' } = req.body;

    // Validate input
    if (!sender_usc_id || !receiver_usc_id || !message) {
      return res.status(400).json({ message: "sender_usc_id, receiver_usc_id, and message are required." });
    }

    // Create message
    const chatMessage = new Chat({
      sender_usc_id,
      receiver_usc_id,
      message,
      message_type,
      status: 'sent'
    });

    await chatMessage.save();

    res.json({ message: "Message sent successfully.", chatMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// PUT /update-profile - Update user profile
router.put("/update-profile", async (req, res) => {
  try {
    const { usc_id, dept, classes, interests, current_year, mentor } = req.body;

    if (!usc_id) {
      return res.status(400).json({ message: "usc_id is required." });
    }

    // Find user
    const user = await User.findOne({ usc_id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields
    const updateData = {};
    if (dept) updateData.dept = dept;
    if (classes) updateData.classes = classes;
    if (interests) updateData.interests = interests;
    if (current_year) updateData.current_year = current_year;
    if (mentor !== undefined) updateData.mentor = mentor;

    const updatedUser = await User.findOneAndUpdate(
      { usc_id },
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
