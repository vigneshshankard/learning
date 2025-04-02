const tf = require('@tensorflow/tfjs-node');

// Preprocess data (e.g., normalization)
function preprocessData(data) {
  return data.map(row => row.map(value => value / 100)); // Example normalization
}

// Train a model
async function trainModel(trainingData, labels) {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [trainingData[0].length], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'linear' })
    ]
  });

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const tensorTrainingData = tf.tensor2d(preprocessData(trainingData));
  const tensorLabels = tf.tensor2d(labels);

  await model.fit(tensorTrainingData, tensorLabels, { epochs: 100 });

  return model;
}

// Evaluate the model
async function evaluateModel(model, testData, testLabels) {
  const tensorTestData = tf.tensor2d(preprocessData(testData));
  const tensorTestLabels = tf.tensor2d(testLabels);

  const loss = model.evaluate(tensorTestData, tensorTestLabels);
  console.log('Model Loss:', loss.dataSync());
}

// Predict using the model
function predict(model, inputData) {
  const tensorInput = tf.tensor2d(preprocessData([inputData]));
  const prediction = model.predict(tensorInput);
  return prediction.dataSync()[0];
}

// Feedback loop for retraining
async function retrainModel(model, newTrainingData, newLabels) {
  const tensorNewData = tf.tensor2d(preprocessData(newTrainingData));
  const tensorNewLabels = tf.tensor2d(newLabels);

  await model.fit(tensorNewData, tensorNewLabels, { epochs: 50 });
  return model;
}

module.exports = { trainModel, evaluateModel, predict, retrainModel };