/**
 * Runs an AI agent to generate a professional README.md for a GitHub repository.
 *
 * @async
 * @function runAiAgent
 * @param {string} owner - The username or organization name that owns the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<string>} - Resolves to the generated README content as a Markdown string.
 *
 * @throws {Error} - If the AI model or tool calls fail, the error is returned.
 *
 * @example
 * const readme = await runAiAgent("microsoft", "vscode");
 * console.log(readme); // Outputs the generated README.md content
 */
import fetchRepo from "./Agents/repoDetails.js";
import fetchTree from "./Agents/treeStructure.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const repoDetailsDeclaration = {
  name: "fetchRepo",
  description:
    "Fetches metadata of a GitHub repository using the GitHub REST API.",
  parameters: {
    type: "object",
    properties: {
      owner: {
        type: "string",
        description:
          "The username or organization name that owns the repository.",
      },
      repo: {
        type: "string",
        description: "The name of the repository.",
      }
    },
    required: ["owner", "repo"],
  },
};

const treeDetailsDeclaration = {
  name: "fetchTree",
  description:
    "Fetches the complete file and folder tree of a GitHub repository.",
  parameters: {
    type: "object",
    properties: {
      owner: {
        type: "string",
        description: "The username or organization that owns the repository.",
      },
      repo: {
        type: "string",
        description: "The name of the repository.",
      },
    },
    required: ["owner", "repo"],
  },
};

async function runAiAgent(owner, repo) {
  try {
    // CORRECT: Initialize the model with tools and system instruction
    let history = [];
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
# ROLE & GOAL
You are an expert AI software analyst and technical writer. Your sole purpose is to generate a complete, professional, template-based README.md for a public GitHub repository. You will receive repository metadata and a file tree, and you must use this data to analyze the project and construct the README.

# WORKFLOW
1.  Your first and only initial action is to call the 'fetchRepo' and 'fetchTree' tools simultaneously. Your first response MUST be this tool call.
2.  After receiving the tool responses, analyze them according to the 'ANALYSIS & INFERENCE LOGIC' below.
3.  Generate a single, complete README.md file as a markdown string. Adhere STRICTLY to the 'REQUIRED README STRUCTURE' defined below.

# ANALYSIS & INFERENCE LOGIC
* **Project Name & Description:** Use the 'name' and 'description' fields from the 'fetchRepo' result. If the description is null, generate a concise one-sentence summary based on the repository's file names and structure.
* **Feature Generation:** This is a critical task. Analyze file names (e.g., 'auth.js', 'api-routes.js', 'image-processor.py') and directory structures ('/controllers', '/services') to infer and generate a list of key project features.
* **Tech Stack Identification:** Determine the primary language(s) from file extensions and identify frameworks or key libraries from manifest files ('package.json', 'requirements.txt', 'pom.xml').
* **Installation Guide Creation:** Based on the manifest files found, generate the appropriate installation commands (e.g., 'npm install', 'pip install -r requirements.txt').
* **Error Handling:** If the tool returns an error (e.g., invalid repo), do not attempt to generate a README. Instead, output a clean error message: "Error: Could not fetch repository data. Please ensure the owner and repository names are correct."

# REQUIRED README STRUCTURE (Adhere to this strictly)

## 1. Project Title
- Create an H1 heading using the repository name.

## 2. Description
- Provide the repository's description. If you had to generate one, use that.

## 3. Features
- Create an H2 heading '✨ Features'.
- Based on your analysis, generate a bulleted list of 2-4 key features.
- Example: If you see 'auth.js', a feature could be "User Authentication".
- If you cannot confidently infer features, provide a placeholder: ""

## 4. Tech Stack
- Create an H2 heading '💻 Tech Stack'.
- List the inferred language(s), framework(s), and key libraries as a bulleted list.

## 5. Project Structure
- Create an H2 heading '📂 Project Structure'.
- Render a clean, markdown-formatted file tree based on the 'fetchTree' result inside a code block.

## 6. Installation Guide
- Create an H2 heading '🚀 Getting Started'.
- Provide the inferred installation commands inside a markdown code block.

## 7. Usage
- Create an H2 heading 'Usage'.
- Provide a placeholder for the user to fill in: ""

## 8. License Information
- Create an H2 heading 'License'.
- State the license name from the repo metadata (e.g., "This project is licensed under the MIT License."). If no license is found, state that it is unlicensed.

# BUGS TO AVOID (Critical Output Rules)
* **No Incomplete Data:** You MUST NOT skip any of the 8 mandatory sections defined above. Use placeholders if information cannot be inferred.
* **No Formatting Issues:** The final output MUST be a single, clean markdown string and nothing else.
* **No Conversational Text:** Do not include apologies or explanations outside of the README markdown (e.g., no "Here is the README...").

`,
      tools: [
        {
          functionDeclarations: [
            repoDetailsDeclaration,
            treeDetailsDeclaration,
          ],
        },
      ],
    });

    // Add initial user prompt to history
    history.push({
      role: "user",
      parts: [
        { text: `Generate a README for the repository ${owner}/${repo}.` },
      ],
    });

    while (true) {
      const result = await model.generateContent({ contents: history });
      const response = result.response;

      // Parts store small small chunks by aiResponse
      const parts = response.candidates[0].content.parts;
      const functionCalls = parts
        .filter((part) => !!part.functionCall)
        .map((part) => part.functionCall);

      const availableTools = { fetchRepo, fetchTree };

      if (functionCalls.length > 0) {
        console.log(
          ` Model is requesting to use tools: ${functionCalls
            .map((c) => c.name)
            .join(", ")}`
        );

        // CORRECT: First, add the model's request to the history
        history.push({
          role: "model",
          parts: parts,
        });

        // This array will hold the results to send back to the model
        const functionResponseParts = [];

        for (const call of functionCalls) {
          const { name, args } = call;
          const funCall = availableTools[name];
          try {
            const apiResponse = await funCall(args);
            // Add each function's result to the array
            functionResponseParts.push({
              functionResponse: {
                name: name,
                response: apiResponse,
              },
            });
          } catch (e) {
            functionResponseParts.push({
              functionResponse: {
                name: name,
                response: { error: "Failed to fetch repo or tree details." },
              },
            });
          }
        }

        // CORRECT: Then, add the results of the tool calls in a single history entry
        history.push({
          role: "function",
          parts: functionResponseParts,
        });
      } else {
        // CORRECT: Extract the final text from the correct location
        const finalText = response.candidates[0].content.parts[0].text;
        return finalText;
        break;
      }
    }
  } catch (e) {
    return e;
  }
}

export default runAiAgent ; 