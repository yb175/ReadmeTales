import runAiAgent from "../model.js";
/**
 * Express controller to generate a README for a GitHub repository.
 *
 * @async
 * @function readme_generator
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.url - GitHub repository URL.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Sends the generated README data or an error response.
 *
 * @throws {404} - If the URL is invalid or not a GitHub repository.
 * @throws {500} - If there is an internal server error while generating README.
 *
 * @example
 * // POST request body: { "url": "https://github.com/microsoft/vscode" }
 * await readme_generator(req, res);
 * // Responds with generated README data
 */
const readme_generator = async (req, res) => {
  const url = req.body.url;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "github.com") {
      return res.status(404).send("Invalid URL: Not a GitHub domain");
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return res.status(404).send("Invalid URL: Missing owner or repository name");
    }

    const owner = parts[0];
    const repo = parts[1];

    const data = await runAiAgent(owner, repo);
    console.log(data);
    res.status(200).send({readme : data});
  } catch (err) {
    console.error("Error in README generation:", err);
    res.status(500).send("Internal Server Error");
  }
}

export default readme_generator;