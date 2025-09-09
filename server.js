/**
 * @fileoverview Express server for README Generator API.
 * Exposes a POST endpoint at /generate-readme to generate a complete, professional README.md
 * based on a GitHub repository's metadata and file structure.
 * Uses CORS for cross-origin requests and parses JSON payloads.
 * Configuration is loaded from environment variables.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import readme_generator from "./Api/generate_readme.js";
import midleware from "./middleware/middleware.js";
import githubAuth from "./Api/auth.js";
import session from "express-session";
dotenv.config();

const app = express();

// CORS Config for credentials
app.use(
  cors({
    origin: ["http://localhost:5173","https://readme-tales-frontend.vercel.app"],
    credentials: true,
  })
);

// For ip of real user if we not write this we would be getting ip of proxy servers for ex vercel,horeku etc
app.set('trust proxy', 1);
// Session Config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Parsing json into js object
app.use(express.json({ limit: "50mb" }));
app.post("/github-auth", githubAuth);
app.post("/generate-readme", midleware, readme_generator);
app.get("/set-token", (req, res) => {
  req.session.access_token = "dummy_test_token";
  res.send("Session access_token set!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listning to PORT ${PORT}`));
