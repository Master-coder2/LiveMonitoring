const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");

// mokey pathing the faceapi canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;

// SsdMobilenetv1Options
const minConfidence = 0.5;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;

// MtcnnOptions
const minFaceSize = 50;
const scaleFactor = 0.8;

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : net === faceapi.nets.tinyFaceDetector
    ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor });
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

const baseDir = path.resolve(__dirname, "./out");
function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  // this is ok for prototyping but using sync methods
  // is bad practice in NodeJS
  fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}

const run = async (buffer) => {
  // load weights
  await faceDetectionNet.loadFromDisk("weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("weights");

  // load the image
  const img = await canvas.loadImage(buffer);

  // detect the faces with landmarks
  const results = await faceapi
    .detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks();
  if (results.length == 0) {
    return 0;
  } else {
    console.log(results[0].detection._score);
    return results[0].detection._score;
  }
};
module.exports = run;
