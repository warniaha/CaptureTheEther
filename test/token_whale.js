const web3 = require('web3');
const TokenWhaleChallenge = artifacts.require("PreTokenWhaleChallengedictHelper");
const TokenWhaleHelper = artifacts.require("TokenWhaleHelper");
const truffleAssert = require("truffle-assertions");

contract("Token Whale", function (accounts) {
    const [alice, bob, chuck, david] = accounts;
    const oneEth = web3.utils.toWei('1', 'ether');

    it.skip("token whale test", async function () {
        var tokenWhaleChallenge = await TokenWhaleChallenge.deployed();
        var tokenWhaleHelper = await TokenWhaleHelper.deployed();
        tokenWhaleChallenge.approve(alice, web3.utils.toWei('10000', 'ether'));
        tokenWhaleChallenge.transferFrom(alice, alice, 1000);
    });
});
