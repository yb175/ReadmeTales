const githubAuth = (async (req,res)=>{
    const {code} = req.body;
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
    })
    const data = await result.json();
    const access_token = data.access_token;
    if(!access_token || access_token.length == 0){
        return res.status(400).send("Invalid access token");
    }
    req.session.access_token = access_token;
    res.send({"message": "success"});
})

export default githubAuth