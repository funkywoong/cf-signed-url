const express = require('express');
const ejs = require('ejs')
const AWS = require('aws-sdk');
require('dotenv').config();

const PORT = 3000;

const CF_PUBLIC_ID = `K1A2HS661MXETR`
const CF_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAxMx/ECT9LapHpJFVcGKe7mAQsiX+8MpdQBwz0cViS6xd7Cyi
IGJ9CRGDY3bfjDPsbjaHt1xt6Dootnib74u5fFIlch4rYHqdAh9eatvixYUFlGpB
+11gw4tepdZ6yzjIFVXZLD0pTZEdhBiZb7EZ4L+RnsGkwXmzODKFKVfeef74SuQM
Bus3w3jgDAfn6PxKL3dQBJ8SR6k4rrZ99N9t4gEOx5XDkmYAiCK5w++Kx4q5wjKf
aYd2lk16Y6WUyRfFz52SPhOXqe7FP1/nmQ+PGekKoCoBnY/V7+yLqC9qwnikYxVn
cOV9NAe92fiMu7plOrB5HSZw7ApP6n2M1lnmJwIDAQABAoIBAQCdj3QzgsnI48nU
Mh+LiQnho7v6RX1lXz9lcq7yReu61lekHN/4uaGNvx3IZoX4BCJI4xOpdDDyeo3Z
+ZovIVjx9frQ8OKdrc1Cw8aeG0nmBeg/uQr2qv4r0MuITr2lMuLOYhsr1hPZbFOL
TP6bc9laHUYDKtozpLIeTiRaw2T1mgqg9/8iVrmFvhRBdeW0B82j58av1j1IwHke
Lnlvs1lWVNkXDFnzVI/6ieiKqnStnSIu04ClV3NAkOdy4NmQYW42fCGcetXpToKx
LL7u9oNVsEzy/6zHtuEpMYJkuQrUYZn+N8Aqvq1LdSa/rnyow8G7YRdyq9gtUKtG
BsvGIctxAoGBAPPGt0Wu23I9TzW8StbY9MXP0Y5qzaPwY/yOwDa4Y9J0z/nlMhRv
KchtQSQB8KpLDWiT3ORcyIdq1SYPY7nULKTwuXtLxL8hSq9DBM9DWCJZ7HrVv7Dg
F2fYVu1HV2yd1+p/jClKYoo8Xqt5qso1KEXJpdGskM4qA30KrDimHTClAoGBAM6q
vrvaQMHX0byAp4jwgPnZ4OV2llxSp/ds9swcCKdBNjKUC6SZwLxPaKi79dgflb4F
fVc9xPO3iPT3NrMl44ioHi2j+ouA9ZqWksX/pO6ZHNaAEP38YbMSHeF7jdMfgLfc
K4uE0+ug9/Q/0r/Yi5yhb+OKSllX2KBumITdyNXbAoGBAO+4xztIM1aJAd7G1hWm
7jWkIt/ZGXYQjFKtEkn9U3R/GJIWmAPOORl2jutY2RCtk3b2iO8saqn4Hbk6wwfX
pTth2hRsMwL9OxNUZWNoR0Aoi8tTbRkDlSCydvEJCeiu48gfO3bTRknIChS4JYKJ
eZv/KwggmZmTaTDKkQd4GxZdAoGBAKjl8iskG3hQISClJEZOB5op7hqZ6BhblNop
OylkX84RBXIge8NxxIohe68qraiLZ518bws1eBiWDl/lCdcvR90PSFqUgNYx9ob4
N8uJOgmlKGRFFZ38/PuT+sekaiv4uwGH9i53x5nyW7JJ1rrjBnZjmUWkZ07M9EVp
HUy41MGxAoGAVviykGLOr2Er4+lvkJc3oH1yoV89goEvHsxTLEDlgcEM4QU3ummG
qjttgH2ODim3rOCU6f6JgPcU+vPMVF4mZ6KbFsPYL8XLAmG03YtoFpr2aHMDuJHP
GYZDvKG/rmg+X9r4HtYCQCUt8vHnxzzjRCmO8yJrjjyOa4f/ckQwYWg=
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

    app.get("/status", (req, res) => {
        return res.status(200).end()
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
