const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: ['http://127.0.0.1:5500','https://gimptt.github.io']
}));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

app.get('/login', (req, res) => {
    const scopes = ['user-top-read']
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null)
    res.redirect(authorizeURL)
})

app.get('/callback', async (req,res) =>{
    const code = req.query.code;

    try{
        const data = await spotifyApi.authorizationCodeGrant(code);

        const accessToken = data.body['access_token']
        const refreshToken = data.body['refresh_token']

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        res.redirect(`https://gimptt.github.io/client/?access_token=${accessToken}`);
    } catch(err){
        console.log(err)
        res.status(500).send('oauth Failed')
    }
})


app.get('/',(req,res) =>{
    res.send('Hello From The Dark Side of the Moon')
})
app.listen(port,'127.0.0.1',() => {
    console.log(`server listending at http://127.0.0.1:${port}`);
})