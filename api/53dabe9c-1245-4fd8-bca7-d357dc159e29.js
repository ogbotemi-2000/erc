let file = require('./977e178c-51cb-4f14-aa34-335f76cb0e20');


module.exports = function(request, response) {
    let {body, query, method} = request;

    response.json({body, query, method})
}