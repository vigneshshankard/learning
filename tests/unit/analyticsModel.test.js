const sequelize = require('../../backend/config/database');
const User = require('../../backend/models/User');
const AnalyticsBasic = require('../../backend/models/AnalyticsBasic');

let reqUser;

describe('AnalyticsBasic Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Initialize models
    await User.sync();
    await AnalyticsBasic.sync();
    
    // Create test user
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'testpass'
    });
    reqUser = testUser.id;
  });
  beforeAll(async () => {
    // Initialize all models
    await sequelize.sync({ force: true });
    
    // Create test user first
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'testpass'
    });
    reqUser = testUser.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create analytics record with valid fields', async () => {
    const analytics = await AnalyticsBasic.create({
      userId: reqUser,
      last5Scores: [85, 90, 78, 92, 88],
      avgAccuracy: 86.5,
      timePerQuestion: 45.2,
      syllabusCoverage: 72.3
    });

    expect(analytics.id).toBeDefined();
    expect(analytics.last5Scores).toEqual([85, 90, 78, 92, 88]);
    expect(analytics.lastUpdated).toBeInstanceOf(Date);
  });

  it('should enforce user association', async () => {
    await expect(
      AnalyticsBasic.create({
        userId: 9999, // invalid user
        last5Scores: [],
        avgAccuracy: 80
      })
    ).rejects.toThrow();
  });

  it('should validate array contents for last5Scores', async () => {
    const user = await User.create({ email: 'test2@analytics.com', password: 'testpass' });
    
    await expect(
      AnalyticsBasic.create({
        userId: user.id,
        last5Scores: ['invalid'], // should be numbers
        avgAccuracy: 80
      })
    ).rejects.toThrow();
  });
});