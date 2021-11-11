import { sleep } from "./getTransactionReceipt";

export default async function waitForNextBlockNumber(web3, callBackFn) {
    var block = await web3.eth.getBlockNumber();
    var nextBlock = block+1;
    while (block !== nextBlock) {
        await sleep(500);
        nextBlock = await web3.eth.getBlockNumber();
        if (block !== nextBlock && callBackFn) {
            if (!callBackFn(nextBlock))
                return;
        }
    }
}
