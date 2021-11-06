const TokenSaleChallenge = artifacts.require("TokenSaleChallenge");
const TokenSaleHelper = artifacts.require("TokenSaleHelper");
const TokenWhaleChallenge = artifacts.require("TokenWhaleChallenge");
const TokenWhaleHelper = artifacts.require("TokenWhaleHelper");

module.exports = function (deployer, network, accounts) {
  // var networkType = web3.eth.net.getNetworkType();
  // if (networkType === 'private')
  //   deployer.deploy(TokenSaleChallenge, accounts[0], { from: accounts[0], value: "1000000000000000000" });
  // deployer.deploy(TokenSaleHelper, { from: accounts[0] });

  // if (networkType === 'private')
  //   deployer.deploy(TokenWhaleChallenge, { from: accounts[0] });
  // deployer.deploy(TokenWhaleHelper, { from: accounts[0] });
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
