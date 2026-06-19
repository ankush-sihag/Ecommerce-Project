const crypto = require('crypto');

const hashResetToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = hashResetToken;