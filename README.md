# ReadmeTales

Express.js backend that fetches repository data via GitHub API, processes it with AI agents (Gemini), and serves structured READMEs through REST APIs.

## ✨ Features

- Fetches repository data from GitHub API.
- Utilizes AI agents (Gemini) to process and structure data.
- Generates README files through REST APIs.
- Includes middleware for API request handling.

## 💻 Tech Stack

- JavaScript
- Express.js

## 📂 Project Structure

```
.
├── .gitignore
├── Agents
│   ├── repoDetails.js
│   └── treeStructure.js
├── Api
│   ├── generate_readme.js
│   └── middleware.js
├── model.js
├── package-lock.json
├── package.json
└── server.js
```

## 🚀 Getting Started

```bash
npm install
```
# Environment Variables Configuration
```
API_KEY=your_gemini_api_key_here

// Password to restrict access to authorized requests only
PASSWORD=your_secure_password_here

// GitHub Personal Access Token
GITHUB_ACCESS_TOKEN=your_github_access_token_here
```
## Usage
nodemon server.js

## License
MIT License

