var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const MappingChallenge = artifacts.require("MappingChallenge");

module.exports = async function (deployer, network, accounts) {
  // if (network !== 'ropsten') {
  //   await deployer.deploy(MappingChallenge, { from: accounts[0]});
  //   const mappingChallenge = await MappingChallenge.deployed();
  //   NetworkContracts.networks[network].MappingChallengeContract = mappingChallenge.address;

  //   // write changes to the config file
  //   var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  //   fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
  // }
};
