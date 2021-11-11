const artifacts = require('../build/contracts/PredictHelper.json')
const contract = require('truffle-contract')
const PredictHelper = contract(artifacts);
PredictHelper.setProvider(web3.currentProvider);

// truffle console --network ropsten
// exec ./test/run_script.js
// https://ethereum.stackexchange.com/questions/36549/how-to-run-a-multiline-script-in-truffle-console

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = function (callback) {
    PredictHelper.deployed()
        .then(async (predictHelper) => {
            const futureAddress = await predictHelper.getOtherContract();
            console.log(`futureAddress: ${futureAddress}`);
            console.log(`predictHelper.address: ${predictHelper.address}`);
            while (true) {
                try {
                    console.log(`Starting loop...`);
                    const guess = await predictHelper.getNumber();
                    console.log(`guess: ${guess.toNumber()}`);
                    await predictHelper.settle()
                    return;
                }
                catch {
                    var counter = 0;
                    var blockNum = await web3.eth.getBlockNumber();
                    var storage0 = await props.web3.eth.getStorageAt(futureAddress, 0);
                    var storage1 = await props.web3.eth.getStorageAt(futureAddress, 1);
                    console.log(`storage0: ${storage0}`);
                    console.log(`storage1: ${storage1}`);

                    while ((await web3.eth.getBlockNumber()) === blockNum) {
                        console.log(`${++counter}`)
                        await sleep(250);
                    }
                }
            }
        })
        .catch(error => {
            console.error(error)
        });
    return;
}
