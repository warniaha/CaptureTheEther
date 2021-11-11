var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const RetirementFundChallenge = artifacts.require("RetirementFundChallenge");
const RetirementFundAttacker = artifacts.require("RetirementFundAttacker");

module.exports = async function (deployer, network, accounts) {
  // if (network !== 'ropsten') {
  //   await deployer.deploy(RetirementFundChallenge, accounts[0], { from: accounts[0], value: "1000000000000000000" });
  //   const retirementFundChallenge = await RetirementFundChallenge.deployed();
  //   NetworkContracts.networks[network].RetirementFundChallengeContract = retirementFundChallenge.address;
  // }
  // await deployer.deploy(RetirementFundAttacker, NetworkContracts.networks[network].RetirementFundChallengeContract, { from: accounts[0], value: "1" });
  // var retirementFundAttacker = await RetirementFundAttacker.deployed();
  // NetworkContracts.networks[network].RetirementFundAttackerContract = retirementFundAttacker.address;

  // // write changes to the config file
  // var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  // fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
