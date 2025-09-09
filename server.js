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
import midleware from "./middleware/middleware.js";
import githubAuth from "./Api/auth.js";
import session from "express-session";
dotenv.config() ; 

const app = express();
// Allowing cross-origin requests
app.use(cors());

// Session Config
app.use(session({
  secret: process.env.SESSION_SECRET || "yoursupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

// Parsing json into js object
app.use(express.json({limit: '50mb'}));
app.post("/github-auth", githubAuth)
app.post("/generate-readme",midleware,readme_generator);
const PORT = process.env.PORT || 3000 ; 
app.listen(PORT,()=>console.log(`Listning to PORT ${PORT}`)) 