let config = require('../config.json');


module.exports = function(request, response) {
    let { TOKEN_SYMBOL, CONTRACT_ADDRESS } = config;
    response
    .json({ TOKEN_SYMBOL, CONTRACT_ADDRESS })
}