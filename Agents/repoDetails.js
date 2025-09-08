/**
 * Fetches metadata of a GitHub repository using the GitHub REST API.
 *
 * @async
 * @function fetchRepo
 * @param {string} owner - The username or organization name that owns the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<Object>} - A promise that resolves to the repository details as a JavaScript object.
 * @throws {Error} - Logs an error if the fetch request fails.
 *
 * @example
 * const repoData = await fetchRepo("microsoft", "vscode");
 * console.log(repoData.name); // "vscode"
 */
async function fetchRepo({owner, repo}) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("The error is:", e);
  }
}

export default fetchRepo;