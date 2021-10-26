const GuessTheNumberChallenge = artifacts.require("GuessTheNumberChallenge");
const GuessTheSecretNumberChallenge = artifacts.require("GuessTheSecretNumberChallenge");

module.exports = function (deployer) {
  deployer.deploy(GuessTheNumberChallenge);
  deployer.deploy(GuessTheSecretNumberChallenge);
};
