const axios = require("axios");
const User = require("../models/users");
require("dotenv").config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const API_KEY = process.env.GEMINI_API_KEY;
console.log("API_KEY: ", API_KEY)

/**
 * Matches a user with the best study buddies using Gemini AI.
 * @param {string} userId - The ID of the user requesting recommendations.
 */
// const getStudyBuddyRecommendations = async (userId) => {
//   try {
//     // Fetch user data from MongoDB
//     console.log("userId: ", userId) 
//     const currentUser = await User.findOne({ _id: userId });
//     if (!currentUser) {
//       throw new Error("User not found");
//     }

//     console.log(
//         "currentUser: ", currentUser
//     )
//     // Fetch all other users (excluding self)
//     const otherUsers = await User.find({ _id: { $ne: userId } });

//     if (!otherUsers.length) {
//       return { message: "No available study buddies at the moment." };
//     }

//     // Format data for AI model
//     const userData = {
//       firstname: currentUser?.firstname,
//       lastname: currentUser?.lastname,
//       dept: currentUser?.dept,
//       classes: currentUser?.classes,
//       mentor: currentUser?.mentor,
//       current_year: currentUser?.current_year,
//       interests: currentUser?.interests,
//     };

//     const candidates = otherUsers.map((user) => ({
//       firstname: user.firstname,
//       lastname: user.lastname,
//       dept: user.dept,
//       classes: user.classes,
//       mentor: user.mentor,
//       current_year: user.current_year,
//       interests: user.interests,
//     }));

//     console.log("userData: ", userData)
//     // AI Prompt for Gemini API
//     const prompt = `
//       You are an AI-powered study buddy recommendation system.
//       Based on the following user profile, find the best study partners.
      
//       User Profile:
//       ${JSON.stringify(userData)}

//       Potential Study Buddies:
//       ${JSON.stringify(candidates)}

//       Consider similar courses, interests, and engagement styles. Provide the top 3 matches.
//     `;

//     console.log("prompt: ", prompt)
//     // Call Gemini API
//     const response = await axios.post(
//         `${GEMINI_API_URL}?key=${API_KEY}`,
//         {
//           contents: [{ role: "user", parts: [{ text: prompt }] }],
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//     );

    
    
//     // Extract AI-generated recommendations
//     const aiResponse = response.data?.candidates?.[0]?.output || response.data?.candidates?.[0]?.content?.parts[0]?.text || "No recommendations available.";

//     return { recommendations: aiResponse };
//   } catch (error) {
//     console.error("Error in study buddy matching:", error.message);
//     return { error: "Failed to get recommendations." };
//   }
// };

const getStudyBuddyRecommendations = async (userId) => {
    try {
      // Fetch user data from MongoDB
      console.log("userId: ", userId);
      const currentUser = await User.findOne({ _id: userId });
      if (!currentUser) {
        throw new Error("User not found");
      }
  
      console.log("currentUser: ", currentUser);
  
      // Fetch all other users (excluding self)
      const otherUsers = await User.find({ _id: { $ne: userId } });
  
      if (!otherUsers.length) {
        return { message: "No available study buddies at the moment." };
      }
  
      // Format data for AI model
      const userData = {
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        dept: currentUser.dept,
        classes: currentUser.classes,
        mentor: currentUser.mentor,
        current_year: currentUser.current_year,
        interests: currentUser.interests,
      };
  
      const candidates = otherUsers.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        dept: user.dept,
        classes: user.classes,
        mentor: user.mentor,
        current_year: user.current_year,
        interests: user.interests,
      }));
  
      console.log("userData: ", userData);
  
      // AI Prompt for Gemini API
      const prompt = `
        You are an AI-powered study buddy recommendation system.
        Based on the following user profile, find the best study partners.
  
        User Profile:
        ${JSON.stringify(userData)}
  
        Potential Study Buddies:
        ${JSON.stringify(candidates)}
  
        Consider similar courses, interests, and engagement styles. Provide ONLY the top 3 study buddy names in JSON format:
        { "names": ["Name1 Lastname1", "Name2 Lastname2", "Name3 Lastname3"] }
      `;
  
      console.log("prompt: ", prompt);
  
      // Call Gemini API
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Extract AI-generated recommendations
      let extractedNames = [];
      const aiResponse =
        response.data?.candidates?.[0]?.output ||
        response.data?.candidates?.[0]?.content?.parts[0]?.text ||
        "No recommendations available.";
  
    //   try {
    //     extractedNames = JSON.parse(aiResponse).names;
    //   } catch (e) {
    //     console.error("Error parsing JSON response. Trying regex extraction...");
    //   }
  
    //   // Fallback: Extract names using regex if response is plain text
    //   if (extractedNames.length === 0) {
    //     const regex = /\*\*([A-Za-z]+ [A-Za-z]+)\*\*/g;
    //     let match;
    //     while ((match = regex.exec(aiResponse)) !== null) {
    //       extractedNames.push(match[1]);
    //     }
    //   }
  
    //   console.log("Extracted Names:", extractedNames);

    try {
        // Remove code block markers (```) and parse JSON
        const cleanedResponse = aiResponse.replace(/```json\n|\n```/g, "");
        extractedNames = JSON.parse(cleanedResponse).names;
      } catch (e) {
        console.error("Error parsing JSON response. Trying regex extraction...");
      }
  
      // Fallback: Extract names using regex if JSON parsing fails
      if (extractedNames.length === 0) {
        const regex = /"names":\s*\[\s*"([^"]+)"(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?\s*\]/;
        const match = aiResponse.match(regex);
        if (match) {
          extractedNames = match.slice(1).filter(Boolean); // Remove undefined matches
        }
      }
  
      console.log("Extracted Names:", extractedNames);
  
      // Fetch users from MongoDB based on extracted names
      const matchedRecords = await User.find({
        $or: extractedNames.map((fullName) => {
          const [firstname, lastname] = fullName.split(" ");
          return { firstname, lastname };
        }),
      });
  
      return { recommendations: matchedRecords };
  
    } catch (error) {
      console.error("Error in study buddy matching:", error.message);
      return { error: "Failed to get recommendations." };
    }
  };
  

module.exports = { getStudyBuddyRecommendations };
