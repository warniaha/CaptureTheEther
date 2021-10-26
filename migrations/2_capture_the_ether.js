const CaptureTheEther = artifacts.require("CaptureTheEther");
const NicknameChallenge = artifacts.require("NicknameChallenge");

module.exports = function (deployer) {
  deployer.deploy(CaptureTheEther);
  deployer.deploy(NicknameChallenge);
};
