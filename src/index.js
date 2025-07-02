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
console.log("Hello World CI/CD just testing");
//const { logPerformance } = require("./utils/perfomanceLogger");
dotenv.config();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(coockieParser());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3008",
      "http://localhost:3002",
      "http://127.0.0.1:3002",
      "http://51.68.172.145:3002",
      "https://serveur.leaders-building.com",
      "https://crm.leaders-building.com",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-api-key",
    "Content-Length",
    "Cache-Control",
    "X-Requested-With",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Handle preflight requests
app.options("*", cors(corsOptions));

/*app.use(
  responseTime((req, res, time) => {
    logPerformance(req, res, time);
  })
);*/
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
connectDB();
app.use("/api", indexRouter);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);
});
