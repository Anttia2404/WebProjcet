import "dotenv/config";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import db from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import chatRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

app.use("/api/auth", authRoutes);
// app.use('/api/posts', postRoutes);

app.use("/api", chatRoutes);
app.use("/api/conversations", conversationRoutes);

app.listen(port, async () => {
  console.log(`Sever is running at port ${port}`);
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Connected to PostgreSQL successfully at:", result.rows[0].now);
  } catch (err) {
    console.error("Unable to connect to PostgreSQL:", err.message);
  }
});
