const artifacts = require('../build/contracts/PredictHelper.json')
const contract = require('truffle-contract')
const PredictHelper = contract(artifacts);
PredictHelper.setProvider(web3.currentProvider);

// truffle exec ./test/run_script.js --network ropsten
// truffle console --network ropsten
// exec ./test/run_script.js
// https://ethereum.stackexchange.com/questions/36549/how-to-run-a-multiline-script-in-truffle-console

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
*/

module.exports = function (callback) {
    PredictHelper.deployed()
        .then(async (predictHelper) => {
            web3.eth.getAccounts().then(e => console.log(e));
            const accounts = await web3.eth.getAccounts();
            const networkType = await web3.eth.net.getNetworkType();
            console.log(`networkType: ${networkType} alice: ${accounts[0]}`);
            if (accounts[0] === undefined)
                return;
            const futureAddress = await predictHelper.getOtherContract();
            console.log(`futureAddress: ${futureAddress}`);
            console.log(`predictHelper.address: ${predictHelper.address}`);
            var attempts = [ '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
            while (true) {
                try {
                    const guess = await predictHelper.getAnswer();
                    console.log(`Starting loop with answer: ${guess.toNumber()}`);
                    attempts[guess] = '0123456789'[guess];
                    await predictHelper.settle({from: accounts[0]});
                    done();
                }
                catch {
                    var counter = 0;
                    var blockNum = await web3.eth.getBlockNumber();
                    var storage0 = await web3.eth.getStorageAt(futureAddress, 0);
                    var storage1 = await web3.eth.getStorageAt(futureAddress, 1);
                    // var storage2 = await web3.eth.getStorageAt(futureAddress, 2);
                    console.log(`storage0: ${storage0}`);
                    console.log(`storage1: ${storage1}`);
                    // console.log(`storage2: ${storage2}`);
                    console.log(`attempts: ${attempts}`);

                    if (networkType === 'ropsten') {
                        while ((await web3.eth.getBlockNumber()) === blockNum) {
                            process.stdout.write(`${++counter}\r`)
                            await sleep(250);
                        }
                    }
                    else {
                        await predictHelper.wasteBlock({from: accounts[0]});
                    }
                }
            }
        })
        .catch(error => {
            console.error(error)
        });
    return;
}
