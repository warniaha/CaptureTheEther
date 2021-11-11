var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const ReadStorage = artifacts.require("ReadStorage");

module.exports = async function (deployer, network, accounts) {
//   if (network !== 'ropsten') {
//     await deployer.deploy(ReadStorage, { from: accounts[0] });
//     const readStorage = await ReadStorage.deployed();
//     NetworkContracts.networks[network].readStorageContract = readStorage.address;
//   }

//   // write changes to the config file
//   var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
//   fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
