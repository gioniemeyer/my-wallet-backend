import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("server running on port 4000");

app.listen(4000);