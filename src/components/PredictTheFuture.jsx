import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const predictHelperAbi = require('../abi/PredictHelper.json').abi;
const predictTheFutureChallengeAbi = require('../abi/PredictTheFutureChallenge.json').abi;
const theAnswer = "0x0000000000000000000000000000000000000000000000000000000000000006";

export default function PredictTheFuture(props) {
    const [predictTheFutureChallengeInstance, setPredictTheFutureChallengeInstance] = React.useState();
    const [predictHelperInstance, setPredictHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState(0);
    const [contractBalance, setContractBalance] = React.useState(0);
    const [calculatedAnswer, setCalculatedAnswer] = React.useState("");
    const [sanity, setSanity] = React.useState();
    const [settling, setSettling] = React.useState(false);
    const [storage0, setStorage0] = React.useState(false);
    const [storage1, setStorage1] = React.useState(false);
    const [storage2, setStorage2] = React.useState(false);

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
                debugger;
                const oneEth = props.web3.utils.toWei('1', 'ether');
                console.log(`OnClickPredictTheFuture called`);
                predictHelperInstance.methods.lockInGuess(theAnswer).send({ from: props.accounts[0], value: oneEth }, async function (error, txHash) {
                    if (error) {
                        alert(`Failed: ${error.message}`);
                    }
                    else {
                        getTransactionReceipt(txHash, props.web3);
                        checkCompleted();
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
        setSettling(true);
        var counter = 0;
        // const interval = setInterval(async () => {
            // var answer = await predictHelperInstance.methods.getAnswer().call();
            // if (answer === '0') {
            //     clearInterval(interval);
                await predictHelperInstance.methods.settle().send({ from: props.accounts[0] }, async function (error, txHash) {
                    if (error)
                        console.log(`Failed: ${error.message}`);
                    else {
                        getTransactionReceipt(txHash, props.web3);
                        checkCompleted();
                        await predictHelperInstance.methods.withdraw().call({ from: props.accounts[0] });
                    }
                });
                setSettling(false);
            // }
            setCalculatedAnswer(`{answer} (${++counter})`);
        // }, 500);
    }

    const getLockinButtonStatus = () => {
        return balance === "1" && predictHelperInstance;
    }

    const getSettleButtonStatus = () => {
        return balance === "2" && !settling;
    }

    const OnClickWasteBlock = async () => {
        await predictHelperInstance.methods.wasteBlock().send({ from: props.accounts[0] }, async function (error, txHash) {
            if (error)
                console.log(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txHash, props.web3);
            }
        });
    }

    const getWasteBlockButton = () => {
        if (props.networkType !== 'ropsten')
            return (<button onClick={OnClickWasteBlock}>Waste block</button>);
        return (<></>);
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!getLockinButtonStatus} onClick={OnClickLockIn}>Lock-in</button>
                <button disabled={!getSettleButtonStatus} onClick={OnClickSettle}>Settle</button>
                <button onClick={readContractData}>Read</button>
                {getWasteBlockButton()}
            </>
        );
    }

    const getBlockNumberView = () => {
        return (
            <div className="divRow">
                <div>Calculated answer: {calculatedAnswer}</div>
                <div>storage0: {storage0}</div>
                <div>storage1: {storage1}</div>
                <div>storage2: {storage2}</div>
            </div>
        );
        // return !isComplete  && balance === "2" ? `${calculatedAnswer}` : "";
    }

    /*
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    const firstByteString = await props.web3.eth.getStorageAt(getNetworkContract(props.networkType, "guessTheRandomNumberChallengeContract"), 0);
    const firstByte = firstByteString.substring(firstByteString.length - 2);
    const bytes = fromHexString(firstByte);
    */
    const readContractData = async () => {
        if (predictTheFutureChallengeInstance) {
            var storage0 = await props.web3.eth.getStorageAt(predictTheFutureChallengeInstance._address, 0);
            var storage1 = await props.web3.eth.getStorageAt(predictTheFutureChallengeInstance._address, 1);
            console.log(`storage0: ${storage0}`);
            console.log(`storage1: ${storage1}`);
            alert(`storage0: ${storage0} storage1: ${storage1}`);
        }
    }

    const sanityCheck = async () => {
        if (sanity === undefined) {
            var otherContract = await predictHelperInstance.methods.getOtherContract().call();
            if (otherContract !== predictTheFutureChallengeInstance._address)
                throw Object.assign(new Error(`helper contract ${otherContract} is wrong, should be pointing to ${predictTheFutureChallengeInstance._address}`), { code: 402 });
            setSanity(true);
        }
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
            props.web3.eth.getStorageAt(predictTheFutureChallengeInstance._address, 0).then(storage => {
                setStorage0(storage);
            });
            props.web3.eth.getStorageAt(predictTheFutureChallengeInstance._address, 1).then(storage => {
                setStorage1(storage);
            });
            props.web3.eth.getStorageAt(predictTheFutureChallengeInstance._address, 2).then(storage => {
                setStorage2(storage);
            });
            sanityCheck();
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
