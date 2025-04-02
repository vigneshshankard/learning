const Notification = require('../models/Notification');
const { sendEmail } = require('../services/notificationService');
const cron = require('node-cron');

// Fetch in-app notifications
async function fetchNotifications(req, res) {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id, channel: 'in_app' } });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Update notification preferences
async function updatePreferences(req, res) {
  try {
    const { emailEnabled, smsEnabled, inAppEnabled } = req.body;
    await db('user_notification_preferences').update({
      email_enabled: emailEnabled,
      sms_enabled: smsEnabled,
      in_app_enabled: inAppEnabled,
    }).where({ user_id: req.user.id });

    res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Retry failed notifications
cron.schedule('*/10 * * * *', async () => {
  const failedNotifications = await Notification.findAll({ where: { status: 'failed', retryCount: { [Op.lt]: 3 } } });

  for (const notification of failedNotifications) {
    try {
      if (notification.channel === 'email') {
        await sendEmail(notification.content.to, 'Notification', notification.content.message);
      }
      notification.status = 'sent';
      await notification.save();
    } catch (error) {
      notification.retryCount += 1;
      await notification.save();
    }
  }
});

module.exports = { fetchNotifications, updatePreferences };