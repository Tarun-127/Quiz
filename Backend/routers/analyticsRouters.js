const express = require("express");
const {
  getAllQuiz,
  getQuestions,
} = require("../controllers/analyticsController");
const verifyAuth = require("../middlewares/verifyAuth");

const router = express.Router();

router.get("/allquiz", verifyAuth, getAllQuiz);
router.post("/getquestions", verifyAuth, getQuestions);

module.exports = router;
