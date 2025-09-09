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
# Flow for authentication 
```
[User Frontend]
     |
     | 1. Click "Login with GitHub"
     v
[GitHub OAuth Page]
     |
     | 2. User authorizes app
     v
[Frontend Receives OAuth Code]
     |
     | 3. POST /auth/github { code } to Backend
     v
[Backend / Node.js + Express]
     |
     | 4. Exchange code for GitHub access_token
     | 5. Store access_token temporarily in memory (not frontend)
     v
[Backend]
     |
     | 6. GET /user/repos → fetch all public + private repos using access_token
     v
[Frontend]
     |
     | 7. Display user repositories (name, description, stars, etc.)
     | 8. User selects repo → request README generation
     v
[Backend / Gemini API]
     |
     | 9. Fetch repo details → Call Gemini API → Generate README sections
     v
[Backend]
     |
     | 10. Return complete README to frontend
     v
[Frontend]
     |
     | 11. Display README + Download option

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

