const bcrypt = require('bcrypt');



const hashToken = async (token) => {
    const salt = await bcrypt.genSalt(12);
    const hashedToken = await bcrypt.hash(token, salt);
    return hashedToken;
}

module.exports = {
    hashToken
}