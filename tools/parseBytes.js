const ethers = require('ethers');

function parseBytes(args) {
 const name = ethers.utils.parseBytes32String(args);
 return name;
}

module.exports.parseBytes=parseBytes;