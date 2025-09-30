import express from "express";
import cors from "cors";
import {neon} from "@neondatabase/serverless";
import pkg from "pg";
import http from "node:http";
import dotenv from "dotenv";
dotenv.config();

const db = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());


const result = await db`SELECT version()`;
console.log(result);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Application exemple à l'écoute sur le port 3000!`);
});


