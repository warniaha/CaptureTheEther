var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const FiftyYearsChallenge = artifacts.require("FiftyYearsChallenge");
const RetirementFundAttacker = artifacts.require("RetirementFundAttacker");

module.exports = async function (deployer, network, accounts) {
  if (network !== 'ropsten') {
    // await deployer.deploy(FiftyYearsChallenge, accounts[0], { from: accounts[0], value: "1000000000000000000" });
    // const fiftyYearsChallenge = await FiftyYearsChallenge.deployed();
    // NetworkContracts.networks[network].FiftyYearsChallengeContract = fiftyYearsChallenge.address;

    // // write changes to the config file
    // var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
    // fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
  }
  // await deployer.deploy(RetirementFundAttacker, NetworkContracts.networks[network].FiftyYearsChallengeContract, { from: accounts[0], value: "2" });
};
