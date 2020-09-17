const fs = require("fs");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: "sIlt2Xwl9HKSjLSqqfTs0IYb3mc8CD05dJbKl-bUEJup",
  }),
  serviceUrl:
    "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/5777f58e-cec4-40ff-9882-d9f3f607bbc8",
});
const speechToTexts = async (audioBuffer, callback) => {
  const recognizeParams = {
    //audio: fs.createReadStream("audio-file2.flac"),
    audio: audioBuffer,
    contentType: "audio/wav",
  };
  speechToText
    .recognize(recognizeParams)
    .then((speechRecognitionResults) => {
      const data = JSON.stringify(speechRecognitionResults, null, 2);
      if (!data) {
        return callback("error");
      }
      // console.log(
      //   JSON.parse(data).result.results[0].alternatives[0].transcript
      // );
      // console.log("hi");
      return callback(
        JSON.parse(data).result.results[0].alternatives[0].transcript
      );
    })
    .catch((err) => {
      // console.log("error:", err);
      callback("error");
    });
};
module.exports = speechToTexts;
