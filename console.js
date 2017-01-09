const sockjs = require("sockjs-client");
const request = require("request");
const config = require("./auth.json");

const sock = new sockjs("https://screeps.com/socket");
var token = null;

sock.onopen = function () {
    const auth = {
        url: "https://screeps.com/api/auth/signin",
        json: true,
        body: {
            email: config.username,
            password: config.password
        }
    };
    request.post(auth, function (err, httpResponse, body) {
        token = body.token;
        sock.send("auth " + token);
        console.log("auth sent")
    });
};

sock.onmessage = function (message) {
    // console.log(message);
    try {
        if(message.type == 'message') {
            // console.log(new Date(message.timeStamp), message.data);

            if(message.data.substring(0,7) === "auth ok") {
                const info = {
                    url: "https://screeps.com/api/auth/me",
                    json: true,
                    headers: {
                        "X-Token": token,
                        "X-Username": config.username,
                    },
                };

                request.get(info, function (err, httpResponse, body) {
                    sock.send("subscribe user:"+body._id+"/console");
                    console.log("subscription sent")
                });
            }

            const json = JSON.parse(message.data);
            const log = json[1].messages.log;
            for(var i in log) {
                console.log(new Date(message.timeStamp), log[i]);
            }
        }
    }
    catch (e) {
    }
};
sock.onclose = function () {
    console.log("socket closed");
};