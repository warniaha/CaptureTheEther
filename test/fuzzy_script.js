

const artifacts = require('../build/contracts/FuzzyIdentityHelper.json')
const contract = require('truffle-contract');
const { BigNumber, ethers } = require('ethers');
// const { HDNode } = require('ethers/lib/utils');
const FuzzyIdentityHelper = contract(artifacts);
FuzzyIdentityHelper.setProvider(web3.currentProvider);
const crypto = require('crypto');

// truffle exec ./test/fuzzy_script.js --network development

const findMatchingPrivateKey = () => {
    const startTime = Date.now().getSeconds();
    const NONCE = BigNumber.from(`0`);
    let foundKey = undefined;
    // choose 512 bits of randomness like BIP39 would for when deriving seed from mnemonic
    // this is probably very inefficient compared to just deriving a key from randomness
    // as it involves several hash functions when deriving the key from index
    const masterKey = ethers.utils.HDNode.fromSeed(crypto.randomBytes(512 / 8));
    const getPathForIndex = (index) => `m/44'/60'/0'/0/${index}`;

    let counter = 0;

    while (!foundKey) {
        const key = masterKey.derivePath(getPathForIndex(counter));
        const from = key.address;
        const contractAddr = ethers.utils.getContractAddress({
            from,
            nonce: NONCE,
        });
        if (contractAddr.toLowerCase().includes(`badc0de`)) {
            foundKey = key;
        }

        counter++;
        if (counter % 1000 == 0) {
            const elapsedTime = Date.now().getSeconds() - startTime;
            process.stdout.write(`Checked ${counter} addresses in ${formatClock(elapsedTime)}\r`);
        }
    }
    return foundKey.privateKey;
};

module.exports = function (callback) {
    const matchingKey = findMatchingPrivateKey();
    console.log(`matchingKey: ${matchingKey}`);
    done();
}
