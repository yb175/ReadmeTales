/**
 * @fileoverview Express server for README Generator API.
 * Exposes a POST endpoint at /generate-readme to generate a complete, professional README.md
 * based on a GitHub repository's metadata and file structure.
 * Uses CORS for cross-origin requests and parses JSON payloads.
 * Configuration is loaded from environment variables.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv" ;
import readme_generator from "./Api/generate_readme.js";
import midleware from "./Api/middleware.js";
dotenv.config() ; 

const app = express({limit : "50mb"});
// Allowing cross-origin requests
app.use(cors());
// Parsing json into js object
app.use(express.json());

app.use("/",midleware)
app.post("/generate-readme", readme_generator);
const PORT = process.env.PORT || 3000 ; 
app.listen(PORT,()=>console.log(`Listning to PORT ${PORT}`)) 