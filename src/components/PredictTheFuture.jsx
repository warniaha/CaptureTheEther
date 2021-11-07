import React from 'react';
import { predictHashHelperAbi } from '../abi/predicthashhelper_abi';
import { predictTheFutureChallengeAbi } from '../abi/predictthefuturechallenge_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { getNetworkContract } from '../utilities/networkUtilities';

var debugCounter = 0;

export default function PredictTheFuture(props) {
    const [predictTheFutureChallengeInstance, setPredictTheFutureChallengeInstance] = React.useState();
    const [predictHelperInstance, setPredictHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [blockNumberRunning, setBlockNumberRunning] = React.useState(false);
    const [predictTheFutureBalance, setPredictTheFutureBalance] = React.useState(0);
    const [guess, setGuess] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!predictTheFutureChallengeInstance)
            loadInstance(predictTheFutureChallengeAbi, getNetworkContract(props.networkType, "predictTheFutureChallengeContract"), setPredictTheFutureChallengeInstance, props.accounts, props.web3);
        if (!predictHelperInstance)
            loadInstance(predictHashHelperAbi, getNetworkContract(props.networkType, "predictHelperContract"), setPredictHelperInstance, props.accounts, props.web3);
    }

    const checkCompleted = React.useCallback(() => {
        if (props.web3 && props.accounts && predictHelperInstance) {
            console.log(`predictHelper.checkCompleted`);
            predictHelperInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`predictHelper.isComplete: ${err}`));
        }
    }, [props.web3, props.accounts, predictHelperInstance, setIsComplete]
    );

    const runBlockHash = React.useCallback(async () => {
        if (blockNumberRunning) {
            if (predictHelperInstance) {
                setBlockNumberRunning(false);
                console.log(`runBlockHash called ${debugCounter++} times`);
                const answer = await predictHelperInstance.methods.getAnswer();
                if (answer === guess) {
                    predictHelperInstance.methods.settle().send({ from: props.accounts[0] }, async function (error, txHash) {
                        if (error) {
                            alert(`settle failed, you probably need to redeploy`);
                        }
                        else {
                            getTransactionReceipt(txHash, props.web3);
                            checkCompleted();
                        }
                    });
                    return;
                }
                setBlockNumberRunning(true);
            }
        }
    }, [blockNumberRunning, setBlockNumberRunning, props.accounts, props.web3, guess, predictHelperInstance, checkCompleted]
    );

    const getBlockHashBalance = React.useCallback(async () => {
        if (props.web3 && predictTheFutureChallengeInstance) {
            console.log(`predictTheFuture.getBlockHashBalance`);
            props.web3.eth.getBalance(predictTheFutureChallengeInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setPredictTheFutureBalance(wei);
            }, 
            err => alert(`predictTheFuture.getBalance: ${err}`));
        }
    }, [setPredictTheFutureBalance, props.web3, predictTheFutureChallengeInstance]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (blockNumberRunning)
                runBlockHash();
        }, 500);
        return () => clearInterval(interval);
    }, [blockNumberRunning, runBlockHash, getBlockHashBalance]);

    const OnClickPredictTheFuture = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            debugger;
            if (predictTheFutureBalance === "1") {
                const oneEth = props.web3.utils.toWei('1', 'ether');
                console.log(`OnClickPredictTheFuture called`);
                predictHelperInstance.methods.lockInGuess("0x0000000000000000000000000000000000000000000000000000000000000000").send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                    if (error) {
                        alert(`Failed: ${error.message}`);
                    }
                    else {
                        setBlockNumberRunning(true);
                        console.log(`predictHelper.guess`);
                        predictHelperInstance.methods.guess.call().then(n => {
                            setGuess(n);
                            console.log(`Guess: ${n}`)
                        }, 
                        err => alert(`predictHelper.guess: ${err}`));
                    }
                });
            }
            else
                alert(`already locked-in`);
        }
        else
            alert(`already completed`);
    }

    const OnClickRestart = async (event) => {
        event.preventDefault();
        debugger;
        const n = await predictHelperInstance.guess.call();
        setGuess(n);
        console.log(`Guess: ${n}`)
        setBlockNumberRunning(true);
    }

    const getEnableRestartPredictStatus = () => {
        return !blockNumberRunning && predictTheFutureBalance === "1" && predictHelperInstance;
    }

    const getEnableRestartButtonStatus = () => {
        return !blockNumberRunning && predictTheFutureBalance === "2";
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!getEnableRestartPredictStatus} onClick={OnClickPredictTheFuture}>Predict the future</button>
                <button disabled={!getEnableRestartButtonStatus} onClick={OnClickRestart}>Restart</button>
            </>
        );
    }

    const getCompleted = () => {
        if (!predictHelperInstance) {
            return "loading";
        }
        checkCompleted();
        getBlockHashBalance();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the future" blocks="" action={getButton()} balance={predictTheFutureBalance} completed={getCompleted()} />
    );
}
