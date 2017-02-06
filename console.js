const sockjs = require("sockjs-client");
const request = require("request");
const auth = require("./auth.json");

const sock = new sockjs("https://screeps.com/socket");
var token = null;

sock.onopen = function () {
  const auth_request = {
    url: "https://screeps.com/api/auth/signin",
    json: true,
    body: {
      email: auth.username,
      password: auth.password
    }
  };
  request.post(auth_request, function (err, httpResponse, body) {
    token = body.token;
    sock.send("auth " + token);
    console.log("auth sent")
  });
};

sock.onmessage = function (message) {
  // console.log(message);
  try {
    if (message.type == 'message') {

      if (message.data.substring(0, 7) === "auth ok") {
        const info = {
          url: "https://screeps.com/api/auth/me",
          json: true,
          headers: {
            "X-Token": token,
            "X-Username": auth.username,
          },
        };

        request.get(info, function (err, httpResponse, body) {
          sock.send("subscribe user:" + body._id + "/console");
          console.log("subscription sent");
          console.log();
        });
      }

      const json = JSON.parse(message.data);
      const log = json[1].messages.log;

      if (log.length > 0) {
        console.log(new Date(message.timeStamp));

        for (var i in log) {
          console.log(`> ${log[i]}`);
        }
        console.log()
      }
    }
  }
  catch (e) {
  }
};
sock.onclose = function () {
  console.log("socket closed");
};