const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/mongoDB");
const coockieParser = require("cookie-parser");
//const morgan = require("morgan");
const indexRouter = require("./Roots/indexRouter");
const path = require("path");
//const responseTime = require("response-time");
//const { logPerformance } = require("./utils/perfomanceLogger");
dotenv.config();
app.use(express.json());
app.use(coockieParser());
const corsOpst = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3008",
    "http://localhost:3002",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
  allowHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-api-key",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
/*app.use(
  responseTime((req, res, time) => {
    logPerformance(req, res, time);
  })
);*/
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors(corsOpst));
connectDB();
app.use("/api", indexRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);
});
