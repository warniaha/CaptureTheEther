import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';

const predictHashHelperAbi = require('../abi/PredictHashHelper.json').abi;
const predictTheBlockHashAbi = require('../abi/PredictTheBlockHashChallenge.json').abi;

export default function PredictTheBlock(props) {
    const [predictTheBlockHashInstance, setPredictTheBlockHashInstance] = React.useState();
    const [predictHashHelperInstance, setPredictHashHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [blockNumberHashRunning, setBlockNumberHashRunning] = React.useState(false);
    const [blockNumberCurrent, setBlockNumberCurrent] = React.useState();
    const [blockNumberTarget, setBlockNumberTarget] = React.useState();
    const [predictTheBlockBalance, setPredictTheBlockBalance] = React.useState(0);

    if (props.web3 && props.accounts && props.networkType) {
        if (!predictTheBlockHashInstance)
            loadInstance(predictTheBlockHashAbi, getNetworkContract(props.networkType, "predictTheBlockHashChallengeContract"), setPredictTheBlockHashInstance, props.accounts, props.web3);
        if (!predictHashHelperInstance)
            loadInstance(predictHashHelperAbi, getNetworkContract(props.networkType, "predictHashHelperContract"), setPredictHashHelperInstance, props.accounts, props.web3);
    }

    const OnClickPredictTheBlockHash = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            var blockNumber = await props.web3.eth.getBlockNumber() + 264;
            setBlockNumberTarget(blockNumber);
            var answer = '0x0000000000000000000000000000000000000000000000000000000000000000';
            await predictHashHelperInstance.methods.lockInGuess(answer).send({ from: props.accounts[0], value: oneEth });
            setBlockNumberCurrent(await props.web3.eth.getBlockNumber());
            setBlockNumberHashRunning(true);
        }
        else
            alert(`already completed`);
    }

    const checkCompleted = React.useCallback(() => {
        if (props.web3 && props.accounts && predictTheBlockHashInstance) {
            console.log(`predictTheBlock.checkCompleted`);
            predictTheBlockHashInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`predictTheBlock.isComplete: ${err}`));
        }
    }, [props.web3, props.accounts, predictTheBlockHashInstance, setIsComplete]
    );

    const getBlockHashBalance = React.useCallback(async () => {
        if (props.web3 && predictTheBlockHashInstance) {
            console.log(`predictTheBlock.getBlockHashBalance`);
            props.web3.eth.getBalance(predictTheBlockHashInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setPredictTheBlockBalance(wei);
            }, 
            err => alert(`predictTheBlock.getBalance: ${err}`));
            checkCompleted();
        }
    }, [props.web3, predictTheBlockHashInstance, checkCompleted]
    );

    const runBlockHash = React.useCallback(async () => {
        if (blockNumberHashRunning) {
            if (blockNumberCurrent > blockNumberTarget) {
                setBlockNumberHashRunning(false);
                await predictHashHelperInstance.methods.settle().send({ from: props.accounts[0] });
                var completed = await predictTheBlockHashInstance.methods.isComplete().call({ from: props.accounts[0] });
                alert(completed ? `PredictTheBlockHash Failed` : `PredictTheBlockHash Success`);
                await predictHashHelperInstance.methods.withdraw().call({ from: props.accounts[0] });
                getBlockHashBalance();
            }
            else
                setBlockNumberCurrent(await props.web3.eth.getBlockNumber());
        }
    }, [blockNumberCurrent, blockNumberTarget, predictTheBlockHashInstance, setBlockNumberHashRunning, props.accounts,
        props.web3, setBlockNumberCurrent, predictHashHelperInstance, blockNumberHashRunning, getBlockHashBalance]
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (blockNumberHashRunning)
                runBlockHash();
        }, 500);
        return () => clearInterval(interval);
    }, [blockNumberHashRunning, runBlockHash]);

    const getBlockWaitingCount = () => {
        if (blockNumberHashRunning) {
            const targetReached = blockNumberCurrent >= blockNumberTarget;
            return targetReached ? "running settle" : blockNumberTarget - blockNumberCurrent;
        }
        return "-";
    }

    const getButton = () => {
        return (
            <button disabled={!predictHashHelperInstance} onClick={OnClickPredictTheBlockHash}>Predict the block</button>
        );
    }

    const getCompleted = () => {
        if (!predictTheBlockHashInstance) {
            return "loading";
        }
        checkCompleted();
        getBlockHashBalance();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the block" blocks={getBlockWaitingCount()} action={getButton()} balance={predictTheBlockBalance} completed={getCompleted()} />
    );
}
