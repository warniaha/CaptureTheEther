var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const GuessTheNumberChallenge = artifacts.require("GuessTheNumberChallenge");
const GuessTheSecretNumberChallenge = artifacts.require("GuessTheSecretNumberChallenge");
const GuessTheNewNumberChallenge = artifacts.require("GuessTheNewNumberChallenge");
const CheatTheNewNumber = artifacts.require("CheatTheNewNumber");

module.exports = async function (deployer, network, accounts) {
  if (network === 'development') {
    await deployer.deploy(GuessTheNumberChallenge, { from: accounts[0], value: "1000000000000000000" });
    var guessTheNumberChallenge = await GuessTheNumberChallenge.deployed();
    NetworkContracts.networks[network].guessTheNumberChallengeContract = guessTheNumberChallenge.address;
  }
  
  if (network === 'development') {
    await deployer.deploy(GuessTheSecretNumberChallenge, { from: accounts[0], value: "1000000000000000000" });
    var guessTheSecretNumberChallenge = await GuessTheSecretNumberChallenge.deployed();
    NetworkContracts.networks[network].guessTheSecretNumberChallengeContract = guessTheSecretNumberChallenge.address;
  }

  if (network === 'development') {
    await deployer.deploy(GuessTheNewNumberChallenge, { from: accounts[0], value: "1000000000000000000" });
    var guessTheNewNumberChallenge = await GuessTheNewNumberChallenge.deployed();
    NetworkContracts.networks[network].guessTheNewNumberChallengeContract = guessTheNewNumberChallenge.address;
  }

  await deployer.deploy(CheatTheNewNumber);
  var cheatTheNewNumber = await CheatTheNewNumber.deployed();
  await cheatTheNewNumber.setOtherContract(NetworkContracts.networks[network].guessTheNewNumberChallengeContract);
  NetworkContracts.networks[network].cheatTheNewNumberContract = cheatTheNewNumber.address;

  // write changes to the config file
  var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
