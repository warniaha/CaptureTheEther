import React from 'react';
import { predictHashHelperAbi } from '../abi/predicthashhelper_abi';
import { predictTheFutureChallengeAbi } from '../abi/predictthefuturechallenge_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import NetworkContracts from '../networkContracts';

var debugCounter = 0;

export default function PredictTheFuture(props) {
    const [predictTheFutureChallengeInstance, setPredictTheFutureChallengeInstance] = React.useState();
    const [predictHelperInstance, setPredictHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [blockNumberRunning, setBlockNumberRunning] = React.useState(false);
    const [predictTheFutureBalance, setPredictTheFutureBalance] = React.useState(0);
    const [guess, setGuess] = React.useState();
    const [predictTheFutureChallengeContract, setPredictTheFutureChallengeContract] = React.useState();
    const [predictHelperContract, setPredictHelperContract] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!predictTheFutureChallengeContract) {
            setPredictTheFutureChallengeContract(NetworkContracts.networks[network].predictTheFutureChallengeContract);
        }

        if (!predictHelperContract) {
            setPredictHelperContract(NetworkContracts.networks[network].predictHelperContract);
        }
    
        if (!predictTheFutureChallengeInstance && predictTheFutureChallengeContract) {
            debugger;
            loadInstance(predictTheFutureChallengeAbi, predictTheFutureChallengeContract, setPredictTheFutureChallengeInstance, props.accounts, props.web3);
        }

        if (!predictHelperInstance && predictHelperContract) {
            debugger;
            loadInstance(predictHashHelperAbi, predictHelperContract, setPredictHelperInstance, props.accounts, props.web3);
        }
    }

    const runBlockHash = React.useCallback(async () => {
        setBlockNumberRunning(false);
        console.log(`runBlockHash called ${debugCounter++} times`);
        const answer = await predictHelperInstance.methods.getAnswer();
        if (answer === guess) {
            predictHelperInstance.methods.settle().send({ from: props.accounts[0] }, async function (error, txHash) {
                if (error) {
                    alert(`settle failed, you probably need to redeploy`);
                }
                else {
                    getTransactionReceipt(txHash);
                    console.log(`runBlockHash callback called`);
                    predictHelperInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
                }
            });
            return;
        }
        setBlockNumberRunning(true);
    }, [setBlockNumberRunning, props.accounts, guess, predictHelperInstance]
    );

    const getBlockHashBalance = React.useCallback(async () => {
        if (props.web3 && predictTheFutureChallengeInstance) {
            props.web3.eth.getBalance(predictTheFutureChallengeInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setPredictTheFutureBalance(wei);
            });
        }
    }, [setPredictTheFutureBalance, props.web3, predictTheFutureChallengeInstance]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (blockNumberRunning)
                runBlockHash();
            getBlockHashBalance();
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
                        predictHelperInstance.methods.guess.call().then(n => {
                            setGuess(n);
                            console.log(`Guess: ${n}`)
                        });
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
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && predictHelperInstance) {
                setIsComplete(false);   // so it doesn't constantly call this
                console.log(`getCompleted called`);
                predictHelperInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the future" blocks="" action={getButton()} balance={predictTheFutureBalance} completed={getCompleted()} />
    );
}
