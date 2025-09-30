import express from "express";
import cors from "cors";
import pkg from "pg";
import http from "node:http";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());




app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Application exemple à l'écoute sur le port 3000!`);
});


