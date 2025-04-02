const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Subtopic = require('../models/Subtopic');
const StudyMaterial = require('../models/StudyMaterial');
const MaterialVersion = require('../models/MaterialVersion');
const { Op } = require('sequelize');
const Redis = require('ioredis');
const redis = new Redis();

// Fetch syllabus hierarchy
async function getHierarchy(req, res) {
  try {
    const cacheKey = 'syllabus_hierarchy';
    const cachedHierarchy = await redis.get(cacheKey);

    if (cachedHierarchy) {
      return res.status(200).json(JSON.parse(cachedHierarchy));
    }

    const subjects = await Subject.findAll({
      include: {
        model: Topic,
        include: Subtopic,
      },
    });

    const hierarchy = subjects.map((subject) => ({
      subject: subject.name,
      topics: subject.Topics.map((topic) => ({
        name: topic.name,
        subtopics: topic.Subtopics.map((subtopic) => subtopic.name),
      })),
    }));

    await redis.set(cacheKey, JSON.stringify(hierarchy), 'EX', 3600); // Cache for 1 hour
    res.status(200).json(hierarchy);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Bulk upload study materials
async function bulkUpload(req, res) {
  const { csvData } = req.body; // Assume CSV data is parsed and passed as JSON
  try {
    for (const row of csvData) {
      const [subject] = await Subject.findOrCreate({ where: { name: row.subject } });
      const [topic] = await Topic.findOrCreate({ where: { name: row.topic, subjectId: subject.id } });
      const [subtopic] = await Subtopic.findOrCreate({ where: { name: row.subtopic, topicId: topic.id } });

      await StudyMaterial.create({
        subtopicId: subtopic.id,
        content: row.content,
        type: row.type,
        createdBy: req.user.id,
      });
    }
    res.status(201).json({ message: 'Bulk upload successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Fetch study material by ID
async function getMaterialById(req, res) {
  const { id } = req.params;
  try {
    const material = await StudyMaterial.findByPk(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update study material
async function updateMaterial(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const material = await StudyMaterial.findByPk(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    await MaterialVersion.create({
      materialId: material.id,
      content: material.content,
      version: material.version,
      updatedBy: req.user.id,
    });

    material.content = content;
    material.version += 1;
    await material.save();

    res.status(200).json({ message: 'Material updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { getHierarchy, bulkUpload, getMaterialById, updateMaterial };