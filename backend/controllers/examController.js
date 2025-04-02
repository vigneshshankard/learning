const Exam = require('../models/Exam');
const Question = require('../models/Question');
const UserTestAttempt = require('../models/UserTestAttempt'); // Added for storing user responses
const { Op } = require('sequelize');
const Redis = require('ioredis');
const redis = new Redis();
const { body, query, validationResult } = require('express-validator');
const { trainModel, predict } = require('../services/mlService');

// Middleware for input validation
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// List active exams with pagination
async function listExams(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const cacheKey = `active_exams_page_${page}_limit_${limit}`;
    const cachedExams = await redis.get(cacheKey);

    if (cachedExams) {
      return res.status(200).json(JSON.parse(cachedExams));
    }

    const exams = await Exam.findAll({
      where: { isActive: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    await redis.set(cacheKey, JSON.stringify(exams), 'EX', 3600); // Cache for 1 hour
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Create or update an exam
const createOrUpdateExam = [
  validate([
    body('id').optional().isInt().withMessage('Exam ID must be an integer'),
    body('title').isString().withMessage('Title must be a string'),
    body('type').isString().withMessage('Type must be a string'),
    body('duration').isInt().withMessage('Duration must be an integer'),
    body('maxQuestions').isInt().withMessage('Max Questions must be an integer'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  ]),
  async (req, res) => {
    const { id, title, type, duration, maxQuestions, isActive } = req.body;
    try {
      if (id) {
        const exam = await Exam.findByPk(id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        exam.title = title;
        exam.type = type;
        exam.duration = duration;
        exam.maxQuestions = maxQuestions;
        exam.isActive = isActive;
        await exam.save();

        return res.status(200).json({ message: 'Exam updated successfully' });
      }

      const newExam = await Exam.create({
        title,
        type,
        duration,
        maxQuestions,
        isActive,
        createdBy: req.user.id,
      });

      res.status(201).json({ message: 'Exam created successfully', examId: newExam.id });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
];

// Manage question pool
async function manageQuestions(req, res) {
  const { examId, questions } = req.body;
  try {
    for (const question of questions) {
      await Question.create({
        examId,
        questionText: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        topic: question.topic,
        difficulty: question.difficulty,
      });
    }
    res.status(201).json({ message: 'Questions added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Add flexibility for different marking schemes
function calculateScore(userAnswers, questions, markingScheme = { correct: 1, incorrect: -0.33 }) {
  let score = 0;
  questions.forEach(q => {
    const userAnswer = userAnswers[q.id];
    if (userAnswer === q.correct_answer) {
      score += markingScheme.correct;
    } else if (userAnswer !== null) {  // Incorrect attempt (not unanswered)
      score += markingScheme.incorrect;
    }
  });
  return Math.max(0, score);  // Prevent negative scores
}

// Store detailed user responses for future analysis
async function submitExam(req, res) {
  const { userId, examId, userAnswers } = req.body;
  try {
    const questions = await Question.findAll({ where: { examId } });
    const score = calculateScore(userAnswers, questions);

    // Store user responses and score
    await UserTestAttempt.create({
      userId,
      examId,
      score,
      responses: userAnswers,
    });

    res.status(200).json({ message: 'Exam submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Adaptive study plan based on user performance
async function generateAdaptiveStudyPlan(req, res) {
  const { userId, performanceData } = req.body; // performanceData: [{ accuracy, timeSpent, difficulty }]
  try {
    // Example training data and labels
    const trainingData = [
      [0.6, 10, 0.5],
      [0.3, 5, 0.8],
    ];
    const labels = [[2], [4]]; // Study hours needed

    // Train the model
    const model = await trainModel(trainingData, labels);

    // Predict study hours for each topic
    const studyPlan = performanceData.map(data => {
      const predictedHours = predict(model, [data.accuracy, data.timeSpent, data.difficulty]);
      return { topic: data.topic, studyHours: predictedHours };
    });

    res.status(200).json({ studyPlan });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { listExams, createOrUpdateExam, manageQuestions, submitExam, generateAdaptiveStudyPlan };