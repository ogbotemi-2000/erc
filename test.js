let store;
    config = require(store = './test.json'),
    fs   = require('fs');

config.CONSTANT = "::CONSTANT.VALUE::",

fs.writeFile(store, format(JSON.stringify(config)), function() {
    console.log('::JSON::', json, format(JSON.stringify(config)))
})

function format(str) {
    return str.replace(/,/g, e=>e+'\n\t').replace(/\{|\}/g, e=>'\n'.repeat(e=='}')+e+'\n\t'.repeat(e=='{'))
}