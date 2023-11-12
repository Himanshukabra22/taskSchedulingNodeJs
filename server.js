const express = require("express");
const fs = require("fs");
const path = require("path")
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconnect = require("./db/connection.js");
const userAuth = require("./routes/userAuth.js")
const {sendNotificationsAll} = require("./controllers/sendNotificationsAll.js")
require("dotenv").config();

const user = require("./models/user.js")

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// app.post("/",async (req,res) => {
// try {
//   const {name,email,password} = req.body
//   let val = await user.create({name,email,password});
//   if(val)
//   {
//       return res.status(200).json({
//         message : "User data saved!"
//       })
// }
// } catch (error) {
//   return res.status(400).json({message : error});
// }
// })

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
