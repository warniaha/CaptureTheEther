export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTransactionReceipt(transactonHash, web3) {
    var transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
    const expectedBlockTime = 1000; // in ms
    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
        await sleep(expectedBlockTime)
        transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
    }
    return transactionReceipt;
}
