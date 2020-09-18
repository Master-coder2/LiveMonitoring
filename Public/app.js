const formData = new FormData();
const video = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const img = document.getElementById("img");
const input = document.querySelector("input");
const x = Math.floor(Math.random() * 10) + 1;
console.log(x);
const run = async () => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;

      video.play();
      canvas.width = video.width;
      canvas.height = video.height;
      const context = canvas.getContext("2d");
      let inActiveTime = 0;
      let matchCnt = 0;
      let imageSave = "false";
      video.addEventListener("play", async () => {
        const drawImage = async () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const src = canvas.toDataURL("image/png");
          sendData(src, inActiveTime, imageSave, matchCnt, (data) => {
            inActiveTime = data.inActiveTime;
            imageSave = data.imageSave;
            matchCnt = data.matchCnt;
            setTimeout(drawImage, 1000 * 10);
          });
        };
        setTimeout(drawImage, 1000 / 24);
      });
    })
    .catch((err) => {
      console.log("An error occurred: " + err);
    });
  const sendData = (base64, inActiveTime, imageSave, matchCnt, callback) => {
    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1);
        n -= 1; // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime });
    };
    const file = dataURLtoFile(base64);
    const data = new FormData();
    data.append("img", file, file.name);
    data.append("inActiveTime", inActiveTime);
    data.append("imageSave", imageSave);
    data.append("matchCnt", matchCnt);
    data.append("no", x);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    axios
      .post("/img", data, config)
      .then((response) => {
        console.log(response.data);
        inActiveTime = response.data.inActiveTime;
        imageSave = response.data.imageSave;
        matchCnt = response.data.matchCnt;
        if (response.data.msg == "notactive") {
          console.log("ih");
          location.replace("/notactive");
        }
        if (response.data.msg == "different") {
          location.replace("/different");
        }
        callback({ inActiveTime, imageSave, matchCnt });
      })
      .catch(() => {
        console.log("error");
      });
  };
};
run();
