export default async function waitForNextBlockNumber(web3) {
    var block = await web3.eth.getBlockNumber();
    var nextBlock = block;
    while (block !== nextBlock) {
        await sleep(500);
        nextBlock = await web3.eth.getBlockNumber();
    }
    // console.log(`block: ${block} nextBlock: ${nextBlock}`);
}