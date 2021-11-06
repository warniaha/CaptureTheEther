var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const PredictTheFutureChallenge = artifacts.require("PredictTheFutureChallenge");
const PredictHelper = artifacts.require("PredictHelper");
const PredictTheBlockHashChallenge = artifacts.require("PredictTheBlockHashChallenge");
const PredictHashHelper = artifacts.require("PredictHashHelper");

module.exports = async function (deployer, network, accounts) {
  if (network === 'development') {
    await deployer.deploy(PredictTheFutureChallenge, { from: accounts[0], value: "1000000000000000000" });
    var predictTheFutureChallenge = await PredictTheFutureChallenge.deployed();
    NetworkContracts.networks[network].predictTheFutureChallengeContract = predictTheFutureChallenge.address;
  }
  await deployer.deploy(PredictHelper, { from: accounts[0] });
  var predictHelper = await PredictHelper.deployed();
  await predictHelper.setOtherContract(NetworkContracts.networks[network].predictTheFutureChallengeContract);
  NetworkContracts.networks[network].predictHelperContract = predictHelper.address;

  if (network === 'development') {
    await deployer.deploy(PredictTheBlockHashChallenge, { from: accounts[0], value: "1000000000000000000" });
    var predictTheBlockHashChallenge = await PredictTheBlockHashChallenge.deployed();
    NetworkContracts.networks[network].predictTheBlockHashChallengeContract = predictTheBlockHashChallenge.address;
  }
  await deployer.deploy(PredictHashHelper, { from: accounts[0] });
  var predictHashHelper = await PredictHashHelper.deployed();
  await predictHashHelper.setOtherContract(NetworkContracts.networks[network].predictTheBlockHashChallengeContract);
  NetworkContracts.networks[network].predictHashHelperContract = predictHashHelper.address;

  // write changes to the config file
  var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};
