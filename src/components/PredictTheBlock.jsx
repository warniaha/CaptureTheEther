import React from 'react';
import { predictHashHelperAbi } from '../abi/predicthashhelper_abi';
import { predictTheBlockHashAbi } from '../abi/predicttheblockhashchallenge_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

const predictTheBlockHashContract = "0x1E2d073a901e54A5e0152AddFE3F69B6A86e4286";
const predictHashHelperContract = "0x7F7D37aacc9E585891E4C4FFf3F55920039cF81a";

export default function PredictTheBlock(props) {
    const [predictTheBlockHashInstance, setPredictTheBlockHashInstance] = React.useState();
    const [predictHashHelperInstance, setPredictHashHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [blockNumberHashRunning, setBlockNumberHashRunning] = React.useState(false);
    const [blockNumberCurrent, setBlockNumberCurrent] = React.useState();
    const [blockNumberTarget, setBlockNumberTarget] = React.useState();
    const [predictTheBlockBalance, setPredictTheBlockBalance] = React.useState(0);

    if (props.web3 && props.accounts) {
        if (!predictTheBlockHashInstance) {
            loadInstance(predictTheBlockHashAbi, predictTheBlockHashContract, setPredictTheBlockHashInstance, props.accounts, props.web3);
        }
        if (!predictHashHelperInstance) {
            loadInstance(predictHashHelperAbi, predictHashHelperContract, setPredictHashHelperInstance, props.accounts, props.web3);
        }
    }

    const OnClickPredictTheBlockHash = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            await predictHashHelperInstance.methods.setPredictTheBlockHashChallengeContract(predictTheBlockHashContract).call({ from: props.accounts[0] });
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

    const runBlockHash = React.useCallback(async () => {
        if (blockNumberCurrent > blockNumberTarget) {
            setBlockNumberHashRunning(false);
            await predictHashHelperInstance.methods.settle().send({ from: props.accounts[0] });
            var completed = await predictTheBlockHashInstance.methods.isComplete().call({ from: props.accounts[0] });
            alert(completed ? `PredictTheBlockHash Failed` : `PredictTheBlockHash Success`);
            await predictHashHelperInstance.methods.withdraw().call({ from: props.accounts[0] });
        }
        else
            setBlockNumberCurrent(await props.web3.eth.getBlockNumber());
    }, [blockNumberCurrent, blockNumberTarget, predictTheBlockHashInstance, setBlockNumberHashRunning, props.accounts,
        props.web3, setBlockNumberCurrent, predictHashHelperInstance]
    );

    const getBlockHashBalance = React.useCallback(async () => {
        if (props.web3 && predictTheBlockHashInstance) {
            props.web3.eth.getBalance(predictTheBlockHashInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setPredictTheBlockBalance(wei);
            });
            await predictTheBlockHashInstance.methods.isComplete().call({ from: props.accounts[0] }).then(completed => {
                setIsComplete(completed);
            })
        }
    }, [setPredictTheBlockBalance, setIsComplete, props.web3, predictTheBlockHashInstance, props.accounts]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (blockNumberHashRunning)
                runBlockHash();
            getBlockHashBalance();
        }, 500);
        return () => clearInterval(interval);
    }, [blockNumberHashRunning, runBlockHash, getBlockHashBalance]);

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
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && predictHashHelperInstance) {
                predictTheBlockHashInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the block" blocks={getBlockWaitingCount()} action={getButton()} balance={predictTheBlockBalance} completed={getCompleted()} />
    );
}
