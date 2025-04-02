const Subscription = require('../models/Subscription');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const cron = require('node-cron');

// Subscribe to Premium
async function subscribe(req, res) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000, // ₹500 in paise
      currency: 'inr',
      payment_method: req.body.paymentMethodId,
      confirm: true,
    });

    await Subscription.create({
      userId: req.user.id,
      planId: 'premium_annual',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentMethod: 'stripe',
      lastPaymentAmount: 500.00,
    });

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Cancel Subscription
async function cancelSubscription(req, res) {
  try {
    const subscription = await Subscription.findOne({ where: { userId: req.user.id } });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    const daysRemaining = (new Date(subscription.endDate) - new Date()) / (1000 * 86400);
    const refundAmount = (daysRemaining / 365) * 500;

    await stripe.refunds.create({
      payment_intent: subscription.paymentIntentId,
      amount: Math.round(refundAmount * 100),
    });

    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ message: 'Subscription canceled and refund processed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

// Auto-renewal Cron Job
cron.schedule('0 0 * * *', async () => {
  const expiringSubscriptions = await Subscription.findAll({
    where: {
      endDate: {
        [Op.lte]: new Date(),
      },
      status: 'active',
    },
  });

  for (const subscription of expiringSubscriptions) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 50000, // ₹500 in paise
        currency: 'inr',
        customer: subscription.userId,
        confirm: true,
      });

      subscription.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      await subscription.save();
    } catch (error) {
      subscription.status = 'expired';
      await subscription.save();
    }
  }
});

module.exports = { subscribe, cancelSubscription };