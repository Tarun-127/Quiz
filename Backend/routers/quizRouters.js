const express = require("express");
const verifyAuth = require("../middlewares/verifyAuth");
const quizController = require("../controllers/quizController");

const router = express.Router();

router.post("/create", verifyAuth, quizController.createQuiz);
router.get("/:quizID", quizController.getQuiz);
router.post("/:quizID", quizController.takeQuiz);
router.delete("/:quizID", verifyAuth, quizController.deleteQuiz);
router.post("/:quizID/poll", quizController.takePoll);
router.get("/trending", verifyAuth, quizController.getTrending);
router.get("/:quizID/question/:questionID", quizController.getQuestion);

module.exports = router;
