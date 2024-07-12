const http = require("node:https");
const HOSTNAME = "tiny.piedevelopers.com";
const PORT = 443;
const PATHNAME = "/API/Shorten";

module.exports.generate = async function (opts) {
  const { url, title = "", expiry = 0, analytics_password } = opts;
  if (!url) throw new Error("No URL provided");
  if (!title) throw new Error("No Title provided");

  const postData = JSON.stringify({
    url,
    expiry,
    link_title: title,
    analytics_password,
  });

  const options = {
    hostname: HOSTNAME,
    port: PORT,
    path: PATHNAME,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        try {
          let body = JSON.parse(chunk);
          if (body.status) {
            resolve(body);
          } else {
            reject(body);
          }
        } catch (e) {
          console.log(chunk);
          reject(e);
        }
      });

      res.on("end", () => {
        resolve(res);
      });

      req.on("error", (e) => {
        reject(e);
      });
    });

    req.write(postData);
    req.end();
  });
};
