// importing inbuild modules
const path = require("path");
const fs = require("fs");
// importing npm modules
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
//importing self module
const run = require("./app.js");
const speechToTexts = require("../api/speechToText");

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
app.get("/notactive", (req, res) => {
  res.render("index", { randomNumber: Math.floor(Math.random() * 10) + 1 });
});
app.post("/img", upload.single("img"), async (req, res) => {
  if (!req.file) {
    res.send("Intternal error");
  } else {
    try {
      const data = await run(req.file.buffer);
      if (data === 0) {
        cnt++;
      } else {
        cnt = 0;
      }
      if (cnt == 3) {
        res.send("notactive");
      } else {
        res.send("active" + cnt);
      }
    } catch (err) {
      res.status(500).send("inertnal error");
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
