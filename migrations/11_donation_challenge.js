var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const DonationChallenge = artifacts.require("DonationChallenge");

module.exports = async function (deployer, network, accounts) {
  // if (network !== 'ropsten') {
  //   await deployer.deploy(DonationChallenge, { from: accounts[0], value: "1000000000000000000" });
  //   const donationChallenge = await DonationChallenge.deployed();
  //   NetworkContracts.networks[network].DonationChallengeContract = donationChallenge.address;

  //   // write changes to the config file
  //   var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  //   fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
  // }
};
