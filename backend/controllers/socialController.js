const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Redis = require('ioredis');
const redis = new Redis();
const Filter = require('bad-words');
const filter = new Filter();

// Create a post
async function createPost(req, res) {
  const { content, type } = req.body;
  try {
    const sanitizedContent = filter.clean(content);
    const post = await Post.create({
      userId: req.user.id,
      content: sanitizedContent,
      type,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Like a post
async function likePost(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes += 1;
    post.engagementScore = post.likes * 0.3 + post.comments * 0.7;
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Add a comment
async function addComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const sanitizedContent = filter.clean(content);
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await Comment.create({
      postId: id,
      userId: req.user.id,
      content: sanitizedContent,
    });

    post.comments += 1;
    post.engagementScore = post.likes * 0.3 + post.comments * 0.7;
    await post.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Fetch activity feed
async function fetchFeed(req, res) {
  try {
    const cacheKey = 'activity_feed';
    const cachedFeed = await redis.get(cacheKey);

    if (cachedFeed) {
      return res.status(200).json(JSON.parse(cachedFeed));
    }

    const posts = await Post.findAll({ order: [['engagementScore', 'DESC']], limit: 100 });
    await redis.set(cacheKey, JSON.stringify(posts), 'EX', 60); // Cache for 1 minute

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = { createPost, likePost, addComment, fetchFeed };