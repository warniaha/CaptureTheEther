pragma solidity 0.4.21;

contract OtherContract {
    address public otherContract = 0;  // usually modified during deployment
    event SetOtherContract(address caller, address newAddress);

    function setOtherContract(address newAddr) public {
        otherContract = newAddr;
        
        emit SetOtherContract(msg.sender, newAddr);
    }

    function getOtherContract() public view returns (address) {
        return otherContract;
    }
}