//const express = require ("express")
import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_SECRET_KEY,
    api_secret : process.env.CLOUDINARY_API_KEY
})

app.use(cors({
    origin : ['http://localhost:3000', 'https://the-gram-frontend-mrvj.onrender.com'],
    credentials: true 
}))


app.get("/" , (req, res) => {
    res.send("Hello World!!");
})

app.use(express.json({
    limit : "5mb"
  
}));

app.use(cookieParser());
app.use(express.urlencoded({
    extended :true
}))



app.use("/api/auth" , authRoute);
app.use("/api/users", userRoutes);
app.use("/api/posts" , postRoute);
app.use("/api/notifications" , notificationRoute);

app.listen(PORT ,()=> {
console.log(`Server is running on ${PORT}`)
connectDB();
})
