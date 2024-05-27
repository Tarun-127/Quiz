const User = require("../models/signupUser");

const convertToK = (num) => {
  return num > 999 ? (num / 1000).toFixed(1) + "K" : num;
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.currentUserId).select("-password");

    if (!user) {
      console.error("User not found:", req.currentUserId);
      return res.status(404).json({ error: "User Not Found!" });
    }

    const newUser = {
      ...user._doc,
      quizCreated: convertToK(user.quizCreated),
      questionsCreated: convertToK(user.questionsCreated),
      totalImpressions: convertToK(user.totalImpressions),
    };
    return res.status(200).json({ user: newUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};
