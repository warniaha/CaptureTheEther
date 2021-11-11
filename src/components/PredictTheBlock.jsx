import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';

const predictHashHelperAbi = require('../abi/PredictHashHelper.json').abi;
const predictTheBlockHashAbi = require('../abi/PredictTheBlockHashChallenge.json').abi;
const waitBlocks = 260;

export default function PredictTheBlock(props) {
    const [predictTheBlockHashInstance, setPredictTheBlockHashInstance] = React.useState();
    const [predictHashHelperInstance, setPredictHashHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState(0);
    const [helperBalance, setHelperBalance] = React.useState(0);
    const [currentBlock, setCurrentBlock] = React.useState(0);
    const [settlementBlock, setSettlementBlock] = React.useState(0);

    if (props.web3 && props.accounts && props.networkType) {
        if (!predictTheBlockHashInstance) {
            const addr = props.web3.utils.toChecksumAddress(getNetworkContract(props.networkType, "predictTheBlockHashChallengeContract"));
            loadInstance(predictTheBlockHashAbi, addr, setPredictTheBlockHashInstance, props.accounts, props.web3);
        }
        if (!predictHashHelperInstance)
            loadInstance(predictHashHelperAbi, getNetworkContract(props.networkType, "predictHashHelperContract"), setPredictHashHelperInstance, props.accounts, props.web3);
    }

    const OnClickLockIn = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            var answer = '0x0000000000000000000000000000000000000000000000000000000000000000';
            await predictHashHelperInstance.methods.lockInGuess(answer).send({ from: props.accounts[0], value: oneEth });
            const currBlock = await props.web3.eth.getBlockNumber();
            setCurrentBlock(currBlock);
        }
        else
            alert(`already completed`);
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (balance === '2') {
                props.web3.eth.getBlockNumber().then(currBlock => {
                    predictHashHelperInstance.methods.getSettlementBlockNumber().call().then(settleBlock => {
                        if (currBlock < settleBlock + waitBlocks)
                            setCurrentBlock(currBlock);
                        if (settlementBlock !== settleBlock)
                            setSettlementBlock(settleBlock);
                    });
                });
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [balance, props, setCurrentBlock, settlementBlock, setSettlementBlock, predictHashHelperInstance]);

    const onClickSettle = async () => {
        await predictHashHelperInstance.methods.settle().send({ from: props.accounts[0] });
        var completed = await predictTheBlockHashInstance.methods.isComplete().call({ from: props.accounts[0] });
        setIsComplete(completed);
        await predictHashHelperInstance.methods.withdraw().call({ from: props.accounts[0] });
        setCurrentBlock(0);
        setSettlementBlock(0);
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!predictHashHelperInstance} onClick={OnClickLockIn}>Lock-In</button>
                <button disabled={!predictHashHelperInstance} onClick={onClickSettle}>Settle</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && predictTheBlockHashInstance && predictHashHelperInstance) {
            console.log(`predictTheBlock.checkCompleted`);
            predictTheBlockHashInstance.methods.isComplete().call().then(completed => setIsComplete(completed),
                err => alert(`predictTheBlock.isComplete: ${err}`));
            if (props.web3 && predictTheBlockHashInstance) {
                console.log(`predictTheBlock.getBalance`);
                props.web3.eth.getBalance(predictTheBlockHashInstance._address).then(balance => {
                    var wei = props.web3.utils.fromWei(balance);
                    setBalance(wei);
                },
                    err => alert(`predictTheBlock.getBalance: ${err}`));
                predictHashHelperInstance.methods.getSettlementBlockNumber().call().then(block => setSettlementBlock(block),
                    err => alert(`predictTheBlock.getSettlementBlockNumber: ${err}`));
                if (props.networkType !== 'ropsten') {
                    props.web3.eth.getBlockNumber().then(currBlock => {
                        setCurrentBlock(currBlock);
                    });
                }
                props.web3.eth.getBalance(predictHashHelperInstance._address).then(balance => {
                    var wei = props.web3.utils.fromWei(balance);
                    setHelperBalance(wei);
                },
                    err => alert(`predictTheBlock.getBalance: ${err}`));
            }
        }
    }

    const blocksWaiting = () => {
        const settleBlk = parseInt(settlementBlock);
        // console.log(`waitBlocks: ${waitBlocks} currentBlock: ${currentBlock} settleBlk: ${settleBlk} waitBlocks+settleBlk-currentBlock: ${waitBlocks+settleBlk-currentBlock}`);
        // console.log(`Types---   waitBlocks: ${typeof(waitBlocks)} currentBlock: ${typeof(currentBlock)} settlementBlock: ${typeof(settlementBlock)}`);
        if (currentBlock !== 0 && settleBlk !== 0 && currentBlock < settleBlk + waitBlocks)
            return `wait: ${waitBlocks+settleBlk-currentBlock}`;
        if (balance === '2')
            return "ready"
        return "";
    }

    const getCompleted = () => {
        if (!predictTheBlockHashInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the block" blocks={blocksWaiting()} action={getButton()} balance={balance+'/'+helperBalance} completed={getCompleted()} />
    );
}
