import dotenv from "dotenv";
/**
 * Fetches the complete file and folder tree of a GitHub repository.
 * 
 * This function uses GitHub's REST API to recursively fetch the repository's 
 * directory structure from the specified branch (defaulted here to `main`).
 * It returns metadata for each file and folder in the repository, including 
 * their paths, types, and SHA identifiers.
 *
 * @async
 * @function fetchTree
 * @param {string} owner - The username or organization that owns the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<Object>} The parsed JSON response containing the repository tree.
 * @throws Will log an error message if the API request fails.
 *
 * @example
 * const tree = await fetchTree('microsoft', 'vscode');
 * console.log(tree);
 */

dotenv.config();
async function fetchTree({ owner, repo }) {
    const headers = {
        'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    }
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`
            , { headers }
        );
        const data = await response.json();
        if (!data.tree || !Array.isArray(data.tree)) {
            throw new Error('Invalid tree data');
        }
        return data;
    } catch (e) {
        console.log("Error fetching tree:", e);
        return { tree: [] };  // Ensures consistent return type
    }
}

export default fetchTree;
