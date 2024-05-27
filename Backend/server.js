const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./database");
// const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routers/authRouters");
const quizRoutes = require("./routers/quizRouters");
const analyticsRoutes = require("./routers/analyticsRouters");

const app = express();

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

connectDB();

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//   })
//   .catch((error) => {
//     console.error("DB failed to connect", error);
//   });

//Routes
app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on : ${PORT}`);
});
