var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const FuzzyIdentityChallenge = artifacts.require("FuzzyIdentityChallenge");
const FuzzyIdentityHelper = artifacts.require("FuzzyIdentityHelper");

module.exports = async function (deployer, network, accounts) {
  if (network !== 'ropsten') {
    await deployer.deploy(FuzzyIdentityChallenge, { from: accounts[0] });
    const fuzzyIdentityChallenge = await FuzzyIdentityChallenge.deployed();
    NetworkContracts.networks[network].FuzzyIdentityChallengeContract = fuzzyIdentityChallenge.address;
  }

  await deployer.deploy(FuzzyIdentityHelper, { from: accounts[0] });
  var fuzzyIdentityHelper = await FuzzyIdentityHelper.deployed();
  NetworkContracts.networks[network].FuzzyIdentityHelperContract = fuzzyIdentityHelper.address;

  // write changes to the config file
  var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
