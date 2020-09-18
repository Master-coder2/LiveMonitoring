const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const load = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("weights");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("weights");
  console.log("loaded");
};
load();
const run = async (no) => {
  const img = await canvas.loadImage(`new${no}.png`);
  const results = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!results) {
    return 0;
  }
  return 1;
};
const isMatch = async (no) => {
  const original_img = await canvas.loadImage(`${no}.png`);
  const detection = await faceapi
    .detectSingleFace(original_img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  const faceMatcher = new faceapi.FaceMatcher(detection.descriptor, 0.5);
  const img = await canvas.loadImage(`new${no}.png`);
  const results = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  const match = await faceMatcher.findBestMatch(results.descriptor);
  console.log(match);
  return match._distance > 0.5 ? "notMatch" : "match";
};

module.exports = { run, isMatch };
