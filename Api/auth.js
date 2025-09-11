// File: Api/auth.js
const githubAuth = async (req, res) => {
    const { code } = req.body;
    console.log("Code:", code);
    if (!code) {
        return res.status(400).json({ error: "GitHub code is missing." });
    }

    try {
        const result = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code
            })
        });

        const data = await result.json();
        const access_token = data.access_token;
        if (!access_token) {
            return res.status(400).json({ error: "Invalid or expired code from GitHub." });
        }

        req.session.access_token = access_token;
        res.status(200).json({ "message": "success" });

    } catch (error) {
        console.error("Error fetching access token:", error);
        res.status(500).json({ error: "Server failed to contact GitHub." });
    }
};

export default githubAuth;