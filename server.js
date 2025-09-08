import express from "express";
import cors from "cors";
import dotenv from "dotenv" ;
dotenv.config() ; 
import readme_generator from "./Api/generate_readme.js";

const app = express({limit : "50mb"});

// Allowing cross-origin requests
app.use(cors());

// Parsing json into js object
app.use(express.json());

app.post("/generate-readme", readme_generator);

const PORT = process.env.PORT || 3000 ; 
app.listen(PORT,()=>console.log(`Listning to PORT ${PORT}`)) 