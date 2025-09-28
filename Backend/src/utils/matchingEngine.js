const User = require("../models/users");

/**
 * Matches a user with the best study buddies using a simple scoring algorithm.
 * @param {string} userId - The ID of the user requesting recommendations.
 */
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

    // Simple recommendation algorithm based on matching criteria
    const recommendations = otherUsers
      .map(user => {
        let score = 0;
        
        // Same department gets high score
        if (user.dept === currentUser.dept) {
          score += 3;
        }
        
        // Same year gets medium score
        if (user.current_year === currentUser.current_year) {
          score += 2;
        }
        
        // Shared classes get high score
        if (currentUser.classes && user.classes) {
          const currentClasses = Array.isArray(currentUser.classes) ? currentUser.classes : [currentUser.classes];
          const userClasses = Array.isArray(user.classes) ? user.classes : [user.classes];
          const sharedClasses = currentClasses.filter(cls => userClasses.includes(cls));
          score += sharedClasses.length * 2;
        }
        
        // Shared interests get medium score
        if (currentUser.interests && user.interests) {
          const currentInterests = Array.isArray(currentUser.interests) ? currentUser.interests : [currentUser.interests];
          const userInterests = Array.isArray(user.interests) ? user.interests : [user.interests];
          const sharedInterests = currentInterests.filter(interest => userInterests.includes(interest));
          score += sharedInterests.length;
        }
        
        // Mentor status gets bonus
        if (user.mentor === true) {
          score += 1;
        }
        
        return {
          user,
          score
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => ({
        _id: item.user._id,
        firstname: item.user.firstname,
        lastname: item.user.lastname,
        dept: item.user.dept,
        classes: item.user.classes,
        mentor: item.user.mentor,
        current_year: item.user.current_year,
        interests: item.user.interests,
        score: item.score
      }));

    return {
      recommendations
    };
  } catch (error) {
    console.error("Error in getStudyBuddyRecommendations:", error);
    return { error: "Failed to get recommendations." };
  }
};

module.exports = { getStudyBuddyRecommendations };