
const CryptoJS = require("crypto-js");
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error('SECRET_KEY environment variable is not set. Please check your .env file.');
}

const hashToken = (data) => {
  if (!data) {
    throw new Error('Data to encrypt cannot be undefined or null');
  }
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
}

const decryptData = (data) => {
  const decryptedData = CryptoJS?.AES?.decrypt(data, secretKey)?.toString(CryptoJS?.enc?.Utf8);
  return JSON?.parse(decryptedData);
}

module.exports = {
    hashToken,
    decryptData
}


