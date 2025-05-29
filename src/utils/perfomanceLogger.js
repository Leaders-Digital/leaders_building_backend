const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

function logPerformance(req, res, time) {
  let logEntry = `[${new Date().toISOString()}}] ${req.method} ${req.url} - ${
    req.statusCode
  } -`;

  if (time < 200) {
    logEntry += chalk.green(time.toFixed(2) + "ms");
  } else {
    logEntry += chalk.red(time.toFixed(2) + "ms");
  }
  logEntry += "\n";
  const logStream = fs.createWriteStream(
    path.join(__dirname, "../performance.log"),
    { flags: "a" }
  );
  logStream.write(logEntry);
}
module.exports = { logPerformance };
