import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import db from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"


const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello from Server!")
})

app.use('/api/auth', authRoutes);

app.listen(port, async () => {
    console.log(`Sever is running at port ${port}`);
    try {
        const result = await db.query("SELECT NOW()");
        console.log("Connected to PostgreSQL successfully at:", result.rows[0].now);
    
    } catch (err) {
        console.error("Unable to connect to PostgreSQL:", err.message);
    }
})