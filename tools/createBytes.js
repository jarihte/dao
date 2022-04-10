const ethers = require('ethers');

function createBytes(args) {
 const bytes = ethers.utils.formatBytes32String(args);
 return bytes;
}

module.exports.createBytes=createBytes;