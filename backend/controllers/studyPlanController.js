const DiagnosticResult = require('../models/DiagnosticResult');
const StudyPlan = require('../models/StudyPlan');
const PlanVersion = require('../models/PlanVersion');
const ProgressTracking = require('../models/ProgressTracking');
const { Op } = require('sequelize');
const Redis = require('ioredis');
const redis = new Redis();

// Submit diagnostic quiz results
async function submitDiagnostic(req, res) {
  const { userId, scores, weakTopics } = req.body;
  try {
    await DiagnosticResult.create({ userId, scores, weakTopics });
    res.status(201).json({ message: 'Diagnostic results submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Generate study plan
async function generateStudyPlan(req, res) {
  const { userId, type, duration } = req.body;
  try {
    const existingPlan = await StudyPlan.findOne({ where: { userId } });
    if (existingPlan) {
      return res.status(400).json({ message: 'User already has an active study plan' });
    }

    const syllabusCoverage = {}; // Placeholder for syllabus coverage logic
    const focusAreas = {}; // Placeholder for focus areas logic

    const newPlan = await StudyPlan.create({
      userId,
      type,
      duration,
      syllabusCoverage,
      focusAreas,
    });

    res.status(201).json({ message: 'Study plan generated successfully', planId: newPlan.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Fetch current study plan
async function fetchStudyPlan(req, res) {
  const { userId } = req.params;
  try {
    const plan = await StudyPlan.findOne({ where: { userId } });
    if (!plan) return res.status(404).json({ message: 'No active study plan found' });

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Adjust static plan
async function adjustStaticPlan(req, res) {
  const { userId, adjustments } = req.body;
  try {
    const plan = await StudyPlan.findOne({ where: { userId, type: 'static' } });
    if (!plan) return res.status(404).json({ message: 'No static plan found' });

    plan.focusAreas = adjustments;
    await plan.save();

    res.status(200).json({ message: 'Static plan adjusted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Trigger AI-driven plan update
async function triggerAIUpdate(req, res) {
  const { userId } = req.body;
  try {
    const plan = await StudyPlan.findOne({ where: { userId, type: 'adaptive' } });
    if (!plan) return res.status(404).json({ message: 'No adaptive plan found' });

    const newFocusAreas = {}; // Placeholder for AI logic

    await PlanVersion.create({
      planId: plan.id,
      focusAreas: plan.focusAreas,
      version: plan.version,
      updatedBy: 'ai',
    });

    plan.focusAreas = newFocusAreas;
    plan.version += 1;
    await plan.save();

    res.status(200).json({ message: 'Adaptive plan updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { submitDiagnostic, generateStudyPlan, fetchStudyPlan, adjustStaticPlan, triggerAIUpdate };