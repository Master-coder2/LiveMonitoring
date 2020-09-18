// importing inbuild modules
const path = require("path");
const fs = require("fs");
// importing npm modules
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
//importing self module
//const run = require("./app.js");
const { run, isMatch } = require("./exp.js");
const speechToTexts = require("../api/speechToText");
const FaceMatching = require("../api/FaceMatching");

// initializing express app
const app = express();

// getting app
const port = process.env.PORT || 3000;

app.use(express.json());
// having a public dir
const publicDir = path.join(__dirname, "../Public");
const viewDir = path.join(__dirname + "/views");
// configuring express
app.use(express.static(publicDir));
app.set("view engine", "hbs");
app.set("views", viewDir);
const upload = multer();
let cnt = 0;
app.get("/", (req, res) => {
  res.render("start");
});
app.get("/different", (req, res) => {
  res.render("different");
});
app.get("/notactive", (req, res) => {
  res.render("index", { randomNumber: Math.floor(Math.random() * 10) + 1 });
});
app.post("/img", upload.single("img"), async (req, res) => {
  let inActiveTime = req.body.inActiveTime;
  let imageSave = req.body.imageSave;
  let matchCnt = req.body.matchCnt;
  const no = req.body.no;
  if (!req.file) {
    res.send("Intternal error");
  } else {
    try {
      await sharp(req.file.buffer).resize(320, 240).toFile(`new${no}.png`);
      const data = await run(no);
      if (data === 0) {
        inActiveTime++;
      } else {
        inActiveTime = 0;
        if (imageSave == "false") {
          console.log("hi");
          await sharp(req.file.buffer).resize(320, 240).toFile(`${no}.png`);
          imageSave = true;
        }
        if (imageSave == "true") {
          const match = await isMatch(no);
          if (match != "match") {
            matchCnt++;
          } else {
            matchCnt = 0;
          }
        }
      }
      let msg = "active";
      if (inActiveTime == 3) {
        msg = "notactive";
      }
      if (matchCnt == 3) {
        msg = "different";
      }
      res.send({
        msg,
        inActiveTime,
        no,
        imageSave,
        matchCnt,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

const sound = multer();

app.post("/uploadSound", sound.any(), (req, res) => {
  // console.log(req.files[0]);
  speechToTexts(req.files[0].buffer, (data) => {
    res.send(data);
  });
});

// starting server
app.listen(port, () => {
  console.log("connected to Port:" + port);
});
