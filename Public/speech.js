let rec = null;
let audioStream = null;

const recordButton = document.getElementById("recordButton");
const transcribeButton = document.getElementById("transcribeButton");
const randomNumber = document.querySelector("#randomNumber").innerText;
recordButton.addEventListener("click", startRecording);
transcribeButton.addEventListener("click", transcribeText);

const a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
const b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function inWords(num) {
  if ((num = num.toString()).length > 9) return "overflow";
  n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str;
}
console.log(randomNumber);
console.log(inWords(randomNumber));

function startRecording() {
  let constraints = { audio: true, video: false };

  recordButton.disabled = true;
  transcribeButton.disabled = false;

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      const audioContext = new window.AudioContext();
      audioStream = stream;
      const input = audioContext.createMediaStreamSource(stream);
      rec = new Recorder(input, { numChannels: 1 });
      rec.record();
    })
    .catch(function (err) {
      recordButton.disabled = false;
      transcribeButton.disabled = true;
    });
}

function transcribeText() {
  transcribeButton.disabled = true;
  recordButton.disabled = false;
  rec.stop();
  audioStream.getAudioTracks()[0].stop();
  rec.exportWAV(uploadSoundData);
}

function uploadSoundData(blob) {
  let filename = new Date().toISOString();
  let xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    if (this.readyState === 4) {
      document.getElementById(
        "output"
      ).innerHTML = `<br><br><strong>Result: </strong>${e.target.responseText}`;
      if (e.target.responseText == inWords(randomNumber)) {
        location.replace("/");
      }
    }
  };
  let formData = new FormData();
  formData.append("audio_data", blob, filename);
  xhr.open("POST", "/uploadSound", true);
  xhr.send(formData);
}
