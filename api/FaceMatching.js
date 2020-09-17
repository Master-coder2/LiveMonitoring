var request = require("request");
var fs = require("fs");
var options = {
  method: "POST",
  url: "https://biometricvisionapi.com/v1/compare",
  headers: {
    "X-Authentication-Token":
      "1nv9vngQsuyrw6K4SebWszbohaR24Ds0hNbBpFnxsGrrjYKWYrbL8PaLcZEVPMO1",
    Content: "application/json",
    Accept: "application/json",
  },
  formData: {
    image1: {
      value: fs.createReadStream("./image1.jpg"),
      options: {
        filename: "image1.jpg",
        contentType: null,
      },
    },
    image2: {
      value: fs.createReadStream("./image2.jpeg"),
      options: {
        filename: "image2.jpeg",
        contentType: null,
      },
    },
  },
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
