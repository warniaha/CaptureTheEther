pragma solidity ^0.4.21;

/*
var readStorage = await ReadStorage.deployed()
await web3.eth.getStorageAt(readStorage.address, 0);
await web3.eth.getStorageAt(readStorage.address, 1);
await web3.eth.getStorageAt(readStorage.address, 2);
await web3.eth.getStorageAt(readStorage.address, 3);
await web3.eth.getStorageAt(readStorage.address, 4);
*/

contract ReadStorage {
    address addr1;  // slot 0
    address addr2;  // slot 1
    address addr3;  // slot 2
    uint8 byte1;    // appended to slot 2
    uint256 largeUint;  // slot 3
    uint8 byte2;    // slot 4
    address addr4;  // appeand to slot 4

    function ReadStorage() public {
      //addr0 = 0x17938f945d23a98b45c98249787b0a1da7ab0334;
      //        0x0000000000000000000000
      //        007cecc381150c422682a943065de75e0bd3fb2541
        addr1 = 0x3333333333333333333333333333333333333333;
        addr2 = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
        addr3 = 0x5555555555555555555555555555555555555555;
        byte1 = 7;
        largeUint = (2**255)-1;
        byte2 = 9;
        addr4 = 0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa;
    }
}
