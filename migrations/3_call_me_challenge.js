var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const CallMeChallenge = artifacts.require("CallMeChallenge");

module.exports = async function (deployer, network, accounts) {
  // if (network !== 'ropsten') {
  //   await deployer.deploy(CallMeChallenge);
  //   var callMeChallenge = await CallMeChallenge.deployed();
  //   NetworkContracts.networks[network].callMeChallengeContract = callMeChallenge.address;
  // }

  // // write changes to the config file
  // var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  // fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
