const AnalyticsBasic = require('../models/AnalyticsBasic');
const Redis = require('ioredis');
const redis = new Redis();
const { trainModel, evaluateModel, predict, retrainModel } = require('../services/mlService');
const { body, validationResult } = require('express-validator');

// Middleware for input validation
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Fetch basic analytics
async function fetchBasicAnalytics(req, res) {
  const { userId } = req.user;
  try {
    const cacheKey = `basic_analytics_${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const analytics = await AnalyticsBasic.findOne({ where: { userId } });
    if (!analytics) return res.status(404).json({ message: 'No analytics data found' });

    await redis.set(cacheKey, JSON.stringify(analytics), 'EX', 3600); // Cache for 1 hour
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Predictive modeling for scores
const predictScore = [
  validate([
    body('studyHours').isFloat({ min: 0 }).withMessage('Study hours must be a positive number'),
    body('coverage').isFloat({ min: 0, max: 100 }).withMessage('Coverage must be between 0 and 100'),
    body('accuracy').isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100'),
  ]),
  async (req, res) => {
    const { studyHours, coverage, accuracy } = req.body;
    try {
      // Example training data and labels
      const trainingData = [
        [0.6, 10, 0.5],
        [0.3, 5, 0.8],
      ];
      const labels = [[2], [4]];

      // Train the model
      const model = await trainModel(trainingData, labels);

      // Predict the score
      const prediction = predict(model, [studyHours, coverage, accuracy]);

      res.status(200).json({ predictedScore: prediction });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
];

// Add time-per-question analysis and visualizations
async function generatePostExamAnalytics(userId, examId) {
  const userAttempt = await UserTestAttempt.findOne({ where: { userId, examId } });
  const questions = await Question.findAll({ where: { examId } });

  const topicWisePerformance = {};
  questions.forEach(q => {
    const userAnswer = userAttempt.responses[q.id];
    const topic = q.topic;

    if (!topicWisePerformance[topic]) {
      topicWisePerformance[topic] = { correct: 0, incorrect: 0, unanswered: 0 };
    }

    if (userAnswer === q.correct_answer) {
      topicWisePerformance[topic].correct++;
    } else if (userAnswer === null) {
      topicWisePerformance[topic].unanswered++;
    } else {
      topicWisePerformance[topic].incorrect++;
    }
  });

  // Generate visualizations (e.g., heatmaps)
  const heatmapPath = await generateHeatmap(topicWisePerformance);

  return {
    score: userAttempt.score,
    topicWisePerformance,
    heatmap: heatmapPath,
  };
}

module.exports = { fetchBasicAnalytics, predictScore, generatePostExamAnalytics };