const dotenv = require("dotenv");
dotenv.config();

const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const signupUser = require("../models/signupUser");
const convertToTitleCase = require("../utils/titleCase");
const generateQuizID = require("../utils/generateQuizID");

exports.createQuiz = async (req, res) => {
  let user = req.user;

  let { name, type, questions } = req.body;
  name = name.toString().toLowerCase();
  type = type.toString().toLowerCase();

  try {
    user = await signupUser.findOne({ _id: user.id });
    if (!user) {
      return res.status(400).json({ error: "User Not Found!" });
    }
    // get user quiz with same name

    let testQuiz = await Quiz.findOne({
      name: convertToTitleCase(name),
      user: user._id,
    });

    if (testQuiz) {
      return res
        .status(400)
        .json({ error: "quiz with same name already exists" });
    }

    if (questions.length > 5) {
      return res.status(400).json({
        error: "Quiz can have at most 5 questions!",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        error: "Quiz Name must be at least 3 characters long!",
      });
    }

    name = convertToTitleCase(name);

    if (type !== "qna" && type !== "poll") {
      return res
        .status(400)
        .json({ error: "Quiz Type can only be QnA or Poll!" });
    }

    if (questions.length < 1) {
      return res
        .status(400)
        .json({ error: "Quiz must have at least 1 question!" });
    }

    // generating Quiz ID
    let quizID = generateQuizID();

    // checking if Quiz ID already exists
    let quizidtest = await Quiz.findOne({ quizID: quizID });
    while (quizidtest) {
      quizID = generateQuizID();
      quizidtest = await Quiz.findOne({ quizID: quizID });
    }

    //validating each question
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
      } = question;
      if (questionText.length < 4) {
        return res.json({
          error: `Question ${i + 1} must be at least 4 characters long!`,
        });
      }

      //timer Validation
      if (question.timer) {
        if (
          question.timer !== 5 &&
          question.timer !== 10 &&
          question.timer !== 0
        ) {
          return res.status(400).json({
            error: `Question ${i + 1} Timer can only be 5, 10 or 0!`,
          });
        }
      }

      // Option Type Validation
      if (
        optionType !== "text" &&
        optionType !== "img" &&
        optionType !== "both"
      ) {
        return res.status(400).json({
          error: `Question ${i + 1} Option Type can only be Text, Image, Both!`,
        });
      }

      // Options Length Validation
      if (options.length < 2) {
        return res.status(400).json({
          error: `Question ${i + 1} must have at least 2 options!`,
        });
      }

      // text Option validation
      for (let j = 0; j < options.length; j++) {
        let option = options[j];
        if (option === null) continue;
        if (option.length < 1) {
          return res.status(400).json({
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      //  Image Option validation

      for (let j = 0; j < imageOptions.length; j++) {
        let option = imageOptions[j];
        if (option === null) continue;
        if (option.length < 1) {
          return res.status(400).json({
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      // Validating correct Answer(text)
      if (optionType === "text" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.status(400).json({
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }

      // Validating correct Answer(img)

      if (optionType === "img" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.status(400).json({
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }
    }

    let finalQuestions = [];

    // Creating each Question
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
        timer,
      } = question;

      if (type === "poll") {
        correctAnswer = "NA";
      }

      let newQuestion = await Quiz.create({
        question: questionText,
        optionType,
        quiz: quizID,
        correctAnswer,
        options,
        imageOptions,
        type,
        timer,
      });
      finalQuestions.push(newQuestion._id);
    }

    // creating new quiz

    let newQuiz = await Quiz.create({
      name,
      type,
      questions: finalQuestions,
      quizID,
      user: user._id,
    });
    user.quizCreated = user.quizCreated + 1;
    user.questionsCreated = questionsCreated + questions.length;
    await user.save();

    return res.status(200).json({
      info: "Quiz Created Successfully!!",
      quizID: newQuiz.quizID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

//getting into quiz

exports.getQuiz = async (req, res) => {
  let quizID = req.params.quizID;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!" });
    }
    //Updating impressions
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();

    let user = await signupUser.findOne({ _id: quiz.user });
    if (!user) {
      return res.status(404).json({ error: "user not found!" });
    }
    user.totalImpressions = user.totalImpressions + 1;
    await user.save();
    return res.json({ quiz });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

//taking into  quiz

exports.takeQuiz = async (req, res) => {
  let quizID = req.params.quizID;
  let { answers } = req.body;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!" });
    }

    if (quiz.type !== "qna") {
      return res.status(404).json({ error: "This is not a qna quizz!" });
    }

    let questions = quiz.questions;
    let score = 0;
    let total = questions.length;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let answer = answers[i];
      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.status(404).json({ error: "Question Not Found!" });
      }

      if (answer !== "") {
        attempted = attempted + 1;
        if (answer === ques.correctAnswer) {
          correct = correct + 1;
          score = score + 1;
          ques.correct = ques.correct + 1;
        } else {
          incorrect = incorrect + 1;
          ques.incorrect = ques.incorrect + 1;
        }
      }
      ques.attempts = ques.attempts + 1;
      await ques.save();
    }

    let result = {
      score,
      total,
      attempted,
      correct,
      incorrect,
    };
    return res.json({ result });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

// Taking poll

exports.takePoll = async (req, res) => {
  const delimeter = "||";
  const quizID = req.params.quizID;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findOne({ quizID });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!" });
    }

    if (quiz.type !== "poll") {
      return res.status(400).json({ error: "This is not a Poll!" });
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const questionID = quiz.questions[i];
      let answer = answers[i];

      const ques = await Question.findById(questionID);
      if (!ques) {
        return res.status(404).json({ error: `Question ${i + 1} Not Found!` });
      }

      answer = processAnswer(ques.optionType, answer);
      updateOptionCount(ques, answer);

      ques.attempts += 1;
      await ques.save();
    }

    return res.status(200).json({ info: "Poll Submitted Successfully!!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

const processAnswer = (optionType, answer) => {
  const parts = answer.split(delimiter);

  if (optionType === "text") {
    return parts[0];
  } else if (optionType === "img") {
    return parts[1];
  } else if (optionType === "both") {
    return parts[0] + parts[1];
  }
  return answer;
};

const updateOptionCount = (ques, answer) => {
  const options = ques.optionType === "text" ? ques.options : ques.imageOptions;
  const optionCountFields = [
    "optedOption1",
    "optedOption2",
    "optedOption3",
    "optedOption4",
  ];

  for (let i = 0; i < options.length; i++) {
    if (
      ques.optionType === "both" &&
      answer === ques.options[i] + ques.imageOptions[i]
    ) {
      ques[optionCountFields[i]] += 1;
      break;
    } else if (answer === options[i]) {
      ques[optionCountFields[i]] += 1;
      break;
    }
  }
};

// delet the quiz

exports.deleteQuiz = async (req, res) => {
  const quizID = req.params.quizID;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findOne({ quizID });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    if (quiz.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this quiz!" });
    }

    // Delete all questions associated with the quiz
    await Question.deleteMany({ _id: { $in: quiz.questions } });

    // Delete the quiz
    await quiz.deleteOne();

    // Update user statistics
    user.quizCreated -= 1;
    user.questionsCreated -= quiz.questions.length;
    user.totalImpressions -= quiz.impressions;
    await user.save();

    return res.status(200).json({ info: "Quiz Deleted Successfully!!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

// for trending the impression

exports.getTrending = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find quizzes by the user, sort by impressions in descending order
    let quizzes = await Quiz.find(
      { user: userId },
      "impressions createdOn name"
    ).sort({ impressions: -1 });

    // Filter quizzes to only include those with impressions greater than 10
    quizzes = quizzes.filter((quiz) => quiz.impressions > 10);
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};

//get question

exports.getQuestion = async (req, res) => {
  const { questionID } = req.params;
  try {
    // Find the question by its ID
    const question = await Question.findOne({ _id: questionID });

    // If question is not found, return a 404 status with an error message
    if (!question) {
      return res.status(404).json({ error: "Question Not Found!" });
    }

    // Return the question if found
    return res.status(200).json({ question });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
};
