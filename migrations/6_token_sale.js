var fs = require('fs');
var NetworkContracts = require('../src/networkContracts');

const TokenSaleChallenge = artifacts.require("TokenSaleChallenge");
const TokenSaleHelper = artifacts.require("TokenSaleHelper");
const TokenWhaleChallenge = artifacts.require("TokenWhaleChallenge");
const TokenWhaleHelper = artifacts.require("TokenWhaleHelper");

module.exports = async function (deployer, network, accounts) {
  // if (network !== 'ropsten') {
  //   await deployer.deploy(TokenSaleChallenge, accounts[0], { from: accounts[0], value: "1000000000000000000" });
  //   const tokenSaleChallenge = await TokenSaleChallenge.deployed();
  //   NetworkContracts.networks[network].tokenSaleChallengeContract = tokenSaleChallenge.address;
  // }
  // await deployer.deploy(TokenSaleHelper, { from: accounts[0] });
  // var tokenSaleHelper = await TokenSaleHelper.deployed();
  // await tokenSaleHelper.setOtherContract(NetworkContracts.networks[network].tokenSaleChallengeContract);
  // NetworkContracts.networks[network].tokenSaleHelperContract = tokenSaleHelper.address;

  // if (network !== 'ropsten') {
  //   await deployer.deploy(TokenWhaleChallenge, accounts[0], { from: accounts[0] });
  //   const tokenWhaleChallenge = await TokenWhaleChallenge.deployed();
  //   NetworkContracts.networks[network].TokenWhaleChallengeContract = tokenWhaleChallenge.address;
  // }
  // await deployer.deploy(TokenWhaleHelper, { from: accounts[0] });
  // var tokenWhaleHelper = await TokenWhaleHelper.deployed();
  // await tokenWhaleHelper.setOtherContract(NetworkContracts.networks[network].TokenWhaleChallengeContract);
  // NetworkContracts.networks[network].TokenWhaleHelperContract = tokenWhaleHelper.address;

  // // write changes to the config file
  // var newNetworkContracts = 'module.exports = ' + JSON.stringify(NetworkContracts, null, 4) + ';';
  // fs.writeFileSync('src/networkContracts.js', newNetworkContracts);
};

/*
  var oneEth = web3.utils.toWei('1', 'ether');
  var tokenSaleChallenge = await TokenSaleChallenge.deployed();
  var tokenSaleHelper = await TokenSaleHelper.deployed();
  tokenSaleHelper.setOtherContract(tokenSaleChallenge.address);
  (await tokenSaleHelper.testTokens()).toNumber()
  await tokenSaleHelper.buy({value: oneEth});

  var oneEth = web3.utils.toWei('1', 'ether');
  var tokenSaleHelper = await TokenSaleHelper.deployed();
  tokenSaleHelper.setOtherContract('0xb8A00d7F7DE0861346ac15301FA58d04daC05424');
  await tokenSaleHelper.buy({value: oneEth});

  115792089237316195423570985008687907853269984665640564039457584007913129639935
  tokens 115792089237316195423570985008687907853269984665640564039457
  eth to pass 584007913129639936
1
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000
00000000


10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

0x10000000000000000000000000000000000000000000000000000000000000000

*/
