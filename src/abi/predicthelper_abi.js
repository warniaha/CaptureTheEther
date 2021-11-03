export const predictHelperAbi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "blockNum",
        "type": "uint256"
      }
    ],
    "name": "getAnswer",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "wasteBlock",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];