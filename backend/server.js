import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Postrouter from "./routes/posts.routes.js";
import Userrouter from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Postrouter);
app.use(Userrouter);
app.use("/uploads", express.static("uploads"));
app.get("/anshu", (req, res) => {
  res.json(`good job anshuman`);
});

const start = async () => {
  const connectDb = mongoose.connect(
    "mongodb+srv://ansumanswain456_db_user:7LT6z5fcNboXYNkf@professiona.otazgiz.mongodb.net/?appName=Professiona",
  );

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};
start();
