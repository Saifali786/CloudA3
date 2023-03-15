// * References: https://www.sohamkamani.com/nodejs/rsa-encryption/

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const publicKey = fs.readFileSync("./public_key.txt", "utf8");

const privateKey = fs.readFileSync("./private_key.txt", "utf8");

app.post("/decrypt", (req, res) => {
  let encryptedData = req.body.message;
  encryptedData = Buffer.from(encryptedData, "base64");
  const plainText = crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      encryptedData
    )
    .toString();
  res.status(200).json({
    response: plainText,
  });
});

app.post("/encrypt", (req, res) => {
  const plainText = req.body.message;
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(plainText)
  );
  console.log(encryptedData.toString());
  res.status(200).json({ response: encryptedData.toString("base64") });
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
