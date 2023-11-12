const express = require("express");
const fs = require("fs");
const path = require("path")
const cors = require("cors");
const bodyParser = require("body-parser");
const schedule = require('node-schedule');
// const moment = require('moment-timezone');
const admin = require('firebase-admin');

const dbconnect = require("./db/connection.js");
const userAuth = require("./routes/userauth.js")
const {sendNotificationsAll} = require("./controllers/sendNotificationsAll.js")
const serviceAccount = require('./serviceAccountKey.json');

require("dotenv").config();

const user = require("./models/user.js")

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initialize Firebase Admin SDK with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use("/api/auth",userAuth)

// Enable CORS for SSE
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const serverStart = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
    sendNotificationsAll();
  } catch (error) {
    console.log(error);
  }
};

serverStart();
