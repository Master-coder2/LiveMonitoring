var request = require("request");
var fs = require("fs");
const FaceMatching = (no, callback) => {
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
        value: fs.createReadStream(`${no}.png`),
        options: {
          filename: `${no}.png`,
          contentType: null,
        },
      },
      image2: {
        value: fs.createReadStream(`new${no}.png`),
        options: {
          filename: `new${no}.png`,
          contentType: null,
        },
      },
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    callback(JSON.parse(response.body));
  });
};

module.exports = FaceMatching;
