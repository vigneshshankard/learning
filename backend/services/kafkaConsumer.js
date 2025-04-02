const kafka = require('kafkajs');
const crypto = require('crypto');
const { KAFKA_SECRET } = require('../config/constants');
const AnalyticsBasic = require('../models/AnalyticsBasic');
const Badge = require('../models/Badge');
const Streak = require('../models/Streak');
const { updateLeaderboard } = require('../controllers/gamificationController');

const consumer = kafka.consumer({ groupId: 'analytics-group' });

// Sign Kafka events with HMAC
function signEvent(event) {
  const hmac = crypto.createHmac('sha256', KAFKA_SECRET);
  hmac.update(JSON.stringify(event));
  return hmac.digest('hex');
}

// Verify Kafka event signature
function verifyEvent(event, signature) {
  const expectedSignature = signEvent(event);
  return expectedSignature === signature;
}

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['test_completed', 'study_plan_updated'] });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value);
      const signature = message.headers['x-signature'];

      if (!verifyEvent(event, signature)) {
        console.error('Invalid event signature');
        return;
      }

      switch (topic) {
        case 'test_completed':
          await handleTestCompleted(event);
          break;
        case 'study_plan_updated':
          await handleStudyPlanUpdated(event);
          break;
      }
    },
  });
}

async function handleTestCompleted(event) {
  const { userId, score } = event;
  const analytics = await AnalyticsBasic.findOne({ where: { userId } });
  if (analytics) {
    analytics.last5Scores = [...(analytics.last5Scores || []).slice(-4), score];
    analytics.avgAccuracy = (analytics.avgAccuracy + score) / 2; // Simplified logic
    analytics.lastUpdated = new Date();
    await analytics.save();
  } else {
    await AnalyticsBasic.create({ userId, last5Scores: [score], avgAccuracy: score });
  }

  // Award badge for mock test milestones
  const attempts = await db('user_test_attempts').count().where({ user_id: userId });
  if (attempts >= 50) {
    const existingBadge = await Badge.findOne({ where: { userId, type: 'mocks_completed', count: 50 } });
    if (!existingBadge) {
      await Badge.create({ userId, type: 'mocks_completed', count: 50 });
    }
  }

  // Update leaderboard
  await updateLeaderboard(userId, score);
}

async function handleStudyPlanUpdated(event) {
  const { userId } = event;
  const streak = await Streak.findOne({ where: { userId } });
  const today = new Date().toISOString().split('T')[0];

  if (streak) {
    if (streak.lastActivityDate === today) return; // Already updated today

    if (isConsecutiveDay(streak.lastActivityDate, today)) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }
    streak.lastActivityDate = today;
    await streak.save();
  } else {
    await Streak.create({ userId, currentStreak: 1, lastActivityDate: today });
  }
}

module.exports = { startConsumer, handleTestCompleted, handleStudyPlanUpdated };