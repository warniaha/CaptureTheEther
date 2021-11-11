const Web3 = require('web3');
const CaptureTheEther = artifacts.require("CaptureTheEther");
const CheatTheNewNumber = artifacts.require("CheatTheNewNumber");
const GuessTheNewNumberChallenge = artifacts.require("GuessTheNewNumberChallenge");
const PredictTheBlockHashChallenge = artifacts.require("PredictTheBlockHashChallenge");
const PredictHashHelper = artifacts.require("PredictHashHelper");
const PredictTheFutureChallenge = artifacts.require("PredictTheFutureChallenge");
const PredictHelper = artifacts.require("PredictHelper");
const truffleAssert = require("truffle-assertions");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 * await web3.eth.getBlockNumber(), await predictHashHelper.wasteBlock()
 */
contract("CaptureTheEtherTest", function (accounts) {
  const [alice, bob, chuck, david] = accounts;
  const oneEth = Web3.utils.toWei('1', 'ether');

  it.skip("should assert true", async function () {
    await CaptureTheEther.deployed();
    return assert.isTrue(true);
  });

  it.skip("should guess the new number", async () => {
    // var cheatTheNewNumber = await CheatTheNewNumber.deployed();
    // var amountRemaining = await cheatTheNewNumber.guess({from: alice, value: oneEth});
    // console.log(`amountRemaining: ${JSON.stringify(amountRemaining)}`);
    console.log(`calling cheatTheNewNumber deployed`);
    var cheatTheNewNumber = await CheatTheNewNumber.deployed();
    // console.log(`cheatTheNewNumber: ${JSON.stringify(cheatTheNewNumber)}`);
    var cheatCode = await cheatTheNewNumber.cheat({ from: alice });
    console.log(`cheatCode: ${JSON.stringify(cheatCode)}`);
    var balance = await cheatTheNewNumber.balance({ from: alice });
    // console.log(`${JSON.stringify(balance)}`);
    // console.log(`balance: ${Web3.utils.fromWei(balance)}`);
    var guess = await cheatTheNewNumber.guess({ from: alice, value: oneEth });
    console.log(`guess: ${JSON.stringify(guess)}`);
    var completed = await cheatTheNewNumber.isComplete({ from: alice });
    console.log(`completed: ${JSON.stringify(completed)}`);
  });

  /*
  const [alice, bob, chuck, david] = accounts;
  const oneEth = web3.utils.toWei('1', 'ether');
  var predictHashHelper = await PredictHashHelper.deployed();
  await predictHashHelper.setPredictTheBlockHashChallengeContract('0x1E2d073a901e54A5e0152AddFE3F69B6A86e4286');
  await predictHashHelper.lockInGuess(answer, { from: accounts[0], value: oneEth })
  await predictHashHelper.settle({ from: alice });
  await predictHashHelper.isComplete();
  await predictHashHelper.withdraw();
  await web3.eth.getBalance('0x1E2d073a901e54A5e0152AddFE3F69B6A86e4286');
  await web3.eth.getBalance(predictHashHelper.address);
  await web3.eth.getBalance(accounts[0]);
  */
  it.skip("should guess the hash", async () => {
    var predictTheBlockHashChallenge = await PredictTheBlockHashChallenge.deployed();
    var predictHashHelper = await PredictHashHelper.deployed();
    truffleAssert.passes(await predictHashHelper.setPredictTheBlockHashChallengeContract(predictTheBlockHashChallenge.address));

    var blockNumTarget = await web3.eth.getBlockNumber() + 264;
    var answer;
    truffleAssert.passes(answer = await predictHashHelper.getAnswer(blockNumTarget));
    console.log(`answer: ${answer}`);
    truffleAssert.passes(await predictHashHelper.lockInGuess(answer, { from: accounts[0], value: oneEth }));
    var blockNumCurrent = await web3.eth.getBlockNumber();
    while (blockNumCurrent < blockNumTarget) {
      truffleAssert.passes(await predictHashHelper.wasteBlock());
      blockNumCurrent = await web3.eth.getBlockNumber();
      console.log(`blockNumCurrent < blockNumTarget: ${blockNumCurrent} < ${blockNumTarget}, waiting for ${blockNumTarget - blockNumCurrent} blocks`);
    }
    truffleAssert.passes(await predictHashHelper.settle({ from: alice }));
    var completed = await predictHashHelper.isComplete();
    assert(completed === true, "Block hash completed");
    var contractBalance = [await web3.eth.getBalance(predictTheBlockHashChallenge.address),
      await web3.eth.getBalance(predictHashHelper.address),
      await web3.eth.getBalance(accounts[0])];
    truffleAssert.passes(await predictHashHelper.withdraw());
    contractBalance.forEach(bal => {
      console.log(`Balance: ${web3.utils.fromWei(bal)}`);
    });
    contractBalance = [await web3.eth.getBalance(predictTheBlockHashChallenge.address),
      await web3.eth.getBalance(predictHashHelper.address),
      await web3.eth.getBalance(accounts[0])];
    contractBalance.forEach(bal => {
      console.log(`Balance: ${web3.utils.fromWei(bal)}`);
    });
  });
  it.skip("should waste 264 blocks", async () => {
    var predictHashHelper = await PredictHashHelper.deployed();
    var blockNumTarget = await web3.eth.getBlockNumber() + 264;
    var blockNumCurrent = await web3.eth.getBlockNumber();
    while (blockNumCurrent < blockNumTarget) {
      truffleAssert.passes(await predictHashHelper.wasteBlock());
      blockNumCurrent = await web3.eth.getBlockNumber();
      console.log(`blockNumCurrent < blockNumTarget: ${blockNumCurrent} < ${blockNumTarget}, waiting for ${blockNumTarget - blockNumCurrent} blocks`);
    }
  });
  async function waitForBlocks(numBlocks) {
    var blockNumTarget = await web3.eth.getBlockNumber() + numBlocks;
    var blockNumCurrent = await web3.eth.getBlockNumber();
    console.log(`blockNumCurrent: ${blockNumCurrent}`);
    while (blockNumCurrent < blockNumTarget) {
      truffleAssert.passes(
        await predictHelper.wasteBlock()
      );
      blockNumCurrent = await web3.eth.getBlockNumber();
      console.log(`blockNumCurrent < blockNumTarget: ${blockNumCurrent} < ${blockNumTarget}, waiting for ${blockNumTarget - blockNumCurrent} blocks`);
    }
  }
  it.skip("Needs to loop until it settles", async () => {
    var predictHelper = await PredictHelper.deployed();
    predictHelper.setOtherContract('0x8642c25737134653D48AdBA27083B4B0D7DCFA2a');
    var attempts = 0;
    var successful = await predictHelper.isComplete();
    for (; successful === false; attempts++) {
      try {
        await predictHelper.settle();
        successful = await predictHelper.isComplete();
        console.log(`successful: ${successful}`);
      }
      catch {
        console.log(`attempts: ${attempts}`);
      }
    }
  });
  /*
  const [alice, bob, chuck, david] = accounts;
  const oneEth = web3.utils.toWei('1', 'ether');
  var predictHelper = await PredictHelper.deployed();
  (await predictHelper.getAnswer(11338000)).toNumber()
  answer = await predictHelper.getAnswer(blockNumTarget)
  predictHelper.setOtherContract('0xbf22BDBE1B1Fc8Eeb61394527f3088df8b92Ea9E');
  var blockNumTarget = await web3.eth.getBlockNumber() + 264;
  answer = await predictHelper.getAnswer(blockNumTarget)
  await predictHelper.lockInGuess(0, {from: accounts[0], value: oneEth})
  -- Wait for 264 blocks --
  await predictHelper.settle()
  await predictHelper.isComplete()
  await predictHelper.withdraw()
  await web3.eth.getBalance('0xbf22BDBE1B1Fc8Eeb61394527f3088df8b92Ea9E');
  await web3.eth.getBalance(predictHelper.address);
  await web3.eth.getBalance(alice);
  */
  it.skip("should predict the future", async () => {
    var predictTheFutureChallenge = await PredictTheFutureChallenge.deployed();
    var predictHelper = await PredictHelper.deployed();
    truffleAssert.passes(
      predictHelper.setOtherContract(predictTheFutureChallenge.address)
    );
    var blockNumTarget = await web3.eth.getBlockNumber() + 264;
    console.log(`blockNumTarget: ${blockNumTarget}`);
    var answer;
    truffleAssert.passes(
      answer = await predictHelper.getAnswer(blockNumTarget)
    );
    console.log(`answer: ${answer}`);
    truffleAssert.passes(
      await predictHelper.lockInGuess(answer, {from: accounts[0], value: oneEth})
    );
    var blockNumCurrent = await web3.eth.getBlockNumber();
    console.log(`blockNumCurrent: ${blockNumCurrent}`);
    while (blockNumCurrent < blockNumTarget) {
      truffleAssert.passes(
        await predictHelper.wasteBlock()
      );
      blockNumCurrent = await web3.eth.getBlockNumber();
      console.log(`blockNumCurrent < blockNumTarget: ${blockNumCurrent} < ${blockNumTarget}, waiting for ${blockNumTarget - blockNumCurrent} blocks`);
    }
    truffleAssert.passes(
      await predictHelper.settle()
    );
    truffleAssert.passes(
      await predictHelper.isComplete()
    );
    truffleAssert.passes(
      await predictHelper.withdraw()
    );
    var balance;
    truffleAssert.passes(
      balance = await web3.eth.getBalance(predictTheFutureChallenge.address)
    );
    assert(balance === '0', "balance should be zero");
  });

  it("should run until the cows come home", async () => {
    var predictHelper = await PredictHelper.deployed();
    while (true) {
      try {
        await predictHelper.settle()
        return;
      }
      catch {
        var counter = 0;
        var blockNum = await web3.eth.getBlockNumber();
        while ((await web3.eth.getBlockNumber()) === blockNum)
          console.log(`${++counter}`)
      }
    }
  });
});
