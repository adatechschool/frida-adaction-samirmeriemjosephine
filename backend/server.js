// extentions
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
// import pkg from "pg";
// import http from "node:http";
import dotenv from "dotenv";
dotenv.config();


const db = neon(process.env.DATABASE_URL);
const app = express();
app.use(cors());
app.use(express.json());
const result = await db `SELECT version()`;
console.log(result);


// create root acceuil
app.get("/", (req, res) => {
    res.send("Hello World!");
    console.log(app.get);
})


// Get all bénévoles
app.get("/benevoles", async (req, res) => {
    try {
    const result = await db `SELECT * FROM benevoles`;
    console.log(result)
    res.json(result);
} catch (error) {
    console.error("Erreur lors de la récupération des bénévoles :", error);
    res.status(500).json({ error: "Erreur serveur" });
}}
);


// écoute du serveur
app.listen(3000, () => {
    console.log("Application exemple à l'écoute sur le port http://localhost:3000");
});


