const dotenv = require("dotenv");

dotenv.config();

const { signupUser } = require("../models/signupUser");

const { Quiz } = require("../models/Quiz");
const { Question } = require("../models/Question");

const convertToK = (num) => {
  return num > 999 ? (num / 1000).toFixed(1) + "K" : num;
};

// to get all quiz

exports.getAllQuiz = async (req, res) => {
  const user = req.user;
  try {
    const quizzes = await Quiz.find(
      { user: user.id },
      "name impression createdOn type quizID"
    );
    if (!quizzes.length) {
      return res.status(200).json({ error: "No Quizzes Found!" });
    }
    const formattedQuizzes = quizzes.map((quiz) => ({
      name: quiz.name,
      impressions: convertToK(quiz.impressions),
      createdOn: quiz.createdOn,
      type: quiz.type,
      quizID: quiz.quizID,
    }));

    return res.status(200).json({ quizzes: formattedQuizzes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

//to get all questions

exports.getQuestions = async (req, res) => {
  const user = req.user;
  const { quizid } = req.body;

  try {
    const quiz = await Quiz.findOne(
      { user: user.id, quizID: quizid },
      "name impressions createdOn type quizID"
    );
    if (!quiz) {
      return res.status(200).json({ error: "Quiz Not Found!" });
    }
    const questions = await Question.find(
      { quiz: quizid },
      "question type options attempts correct incorrect optedOption1 optedOption2 optedOption3 optedOption4"
    );

    return res.status(200).json({ questions, quiz });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};
