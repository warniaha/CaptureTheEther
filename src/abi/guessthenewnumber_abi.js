export var guessTheNewNumberAbi = [
    {
        "inputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isComplete",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "n",
                "type": "uint8"
            }
        ],
        "name": "guess",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }
];
