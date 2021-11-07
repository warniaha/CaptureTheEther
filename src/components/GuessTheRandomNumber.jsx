import React from 'react';
import { guessTheRandomNumberAbi } from '../abi/guesstherandomnumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { fromHexString } from '../utilities/hexstring';
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

export default function GuessTheRandomNumber (props) {
    const [guessTheRandomNumberInstance, setGuessTheRandomNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!guessTheRandomNumberInstance)
            loadInstance(guessTheRandomNumberAbi, getNetworkContract(props.networkType, "guessTheRandomNumberChallengeContract"), setGuessTheRandomNumberInstance, props.accounts, props.web3);
    }

    const OnClickFindTheRandomNumber = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            const firstByteString = await props.web3.eth.getStorageAt(getNetworkContract(props.networkType, "guessTheRandomNumberChallengeContract"), 0);
            const firstByte = firstByteString.substring(firstByteString.length - 2);
            const bytes = fromHexString(firstByte);
            const number = bytes[0];

            guessTheRandomNumberInstance.methods.guess(number).send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    getTransactionReceipt(txHash, props.web3);
                    checkCompleted();
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!guessTheRandomNumberInstance} onClick={OnClickFindTheRandomNumber}>Guess the random number</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && guessTheRandomNumberInstance) {
            console.log(`guessTheRandomNumber.checkCompleted`);
            guessTheRandomNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`guessTheRandomNumber.isComplete: ${err}`));
            props.web3.eth.getBalance(guessTheRandomNumberInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`guessTheRandomNumber.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!guessTheRandomNumberInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the random number" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
