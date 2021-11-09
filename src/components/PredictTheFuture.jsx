import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const predictHelperAbi = require('../abi/PredictHelper.json').abi;
const predictTheFutureChallengeAbi = require('../abi/PredictTheFutureChallenge.json').abi;

export default function PredictTheFuture(props) {
    const [predictTheFutureChallengeInstance, setPredictTheFutureChallengeInstance] = React.useState();
    const [predictHelperInstance, setPredictHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [lockInBlockNumber, setLockInBlockNumber] = React.useState(false);
    const [balance, setBalance] = React.useState(0);
    const [contractBalance, setContractBalance] = React.useState(0);

    if (props.web3 && props.accounts && props.networkType) {
        if (!predictTheFutureChallengeInstance)
            loadInstance(predictTheFutureChallengeAbi, getNetworkContract(props.networkType, "predictTheFutureChallengeContract"), setPredictTheFutureChallengeInstance, props.accounts, props.web3);
        if (!predictHelperInstance)
            loadInstance(predictHelperAbi, getNetworkContract(props.networkType, "predictHelperContract"), setPredictHelperInstance, props.accounts, props.web3);
    }

    const OnClickLockIn = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            if (balance === "1") {
                const oneEth = props.web3.utils.toWei('1', 'ether');
                console.log(`OnClickPredictTheFuture called`);
                predictHelperInstance.methods.lockInGuess("0x0000000000000000000000000000000000000000000000000000000000000000").send({ from: props.accounts[0], value: oneEth }, async function (error, txHash) {
                    if (error) {
                        alert(`Failed: ${error.message}`);
                    }
                    else {
                        const blockNumber = await props.web3.eth.getBlockNumber();
                        setLockInBlockNumber(blockNumber);
                        console.log(`predictHelper.guess`);
                    }
                });
            }
            else
                alert(`already locked-in`);
        }
        else
            alert(`already completed`);
    }

    const OnClickSettle = async (event) => {
        event.preventDefault();
        await predictHelperInstance.methods.settle().send({ from: props.accounts[0] }, async function (error, txHash) {
            if (error)
                console.log(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txHash, props.web3);
                checkCompleted();
                await predictHelperInstance.methods.withdraw().call({ from: props.accounts[0] });
            }
        });
    }

    const getLockinButtonStatus = () => {
        return !lockInBlockNumber && balance === "1" && predictHelperInstance;
    }

    const getSettleButtonStatus = () => {
        return balance === "2";
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!getLockinButtonStatus} onClick={OnClickLockIn}>Lock-in</button>
                <button disabled={!getSettleButtonStatus} onClick={OnClickSettle}>Settle</button>
            </>
        );
    }

    const getBlockNumberView = () => {
        return lockInBlockNumber ? `${lockInBlockNumber}` : "";
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && predictHelperInstance) {
            console.log(`predictHelper.checkCompleted`);
            predictHelperInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`predictHelper.isComplete: ${err}`));

            console.log(`predictTheFuture.getBlockHashBalance`);
            props.web3.eth.getBalance(predictTheFutureChallengeInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, 
            err => alert(`predictTheFuture.getBalance: ${err}`));
            props.web3.eth.getBalance(predictHelperInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setContractBalance(wei);
            }, 
            err => alert(`predictTheFuture.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!predictHelperInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Predict the future" blocks={getBlockNumberView()} action={getButton()} balance={balance + '/' + contractBalance} completed={getCompleted()} />
    );
}
