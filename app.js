const express = require('express');
const ejs = require('ejs')
const AWS = require('aws-sdk');
require('dotenv').config();

const PORT = 3000;

const CF_PUBLIC_ID = `{visang-public key id}`
const CF_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
...
-----END RSA PRIVATE KEY-----`

const signer = new AWS.CloudFront.Signer(
    CF_PUBLIC_ID, CF_PRIVATE_KEY
);

const expTime = 60 * 60 * 1000;

async function startServer() {
    
    const app = express();

    // Set view module
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/'));

    app.get("/", (req, res) => {
        res.render("sample", {})
    })

    app.get("/cdn", (req, res) => {
        const signedUrl = signer.getSignedUrl({
            url: 'https://d1dj3bm16kgai7.cloudfront.net/output/sample-5s.mp4',
            expires: Math.floor((Date.now() + expTime) / 1000)
        });
        console.log(signedUrl);
        res.json({
            "One time URL will be expired in 1 hour" : signedUrl
        })

    })

    app.listen(PORT, () => {
        console.log(`
            ################################################
                Server listening on port : ${PORT}
            ################################################
        `);
    }).on('error', err => {
        console.log(err.stack);
        process.exit(1);
    });

}

startServer();
