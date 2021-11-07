var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const CaptureTheEther = artifacts.require("CaptureTheEther");
const NicknameChallenge = artifacts.require("NicknameChallenge");

module.exports = async function (deployer, network, accounts) {
  // if (network === 'development') {
  //   await deployer.deploy(CaptureTheEther);
  //   var captureTheEther = await CaptureTheEther.deployed();
  //   NetworkContracts.networks[network].captureTheEtherContract = captureTheEther.address;
  // }

  // if (network === 'development') {
  //   await deployer.deploy(NicknameChallenge, accounts[0]);
  //   var nicknameChallenge = await NicknameChallenge.deployed();
  //   NetworkContracts.networks[network].nicknameChallengeContract = nicknameChallenge.address;
  // }

  // // write changes to the config file
  // var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  // fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
