import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const guessTheNumberAbi = require('../abi/GuessTheNumberChallenge.json').abi;

export default function GuessTheNumber (props) {
    const [guessTheNumberInstance, setGuessTheNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!guessTheNumberInstance)
            loadInstance(guessTheNumberAbi, getNetworkContract(props.networkType, "guessTheNumberChallengeContract"), setGuessTheNumberInstance, props.accounts, props.web3);
    }

    const OnClickGuessTheNumber = (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            guessTheNumberInstance.methods.guess(42).send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else
                {
                    getTransactionReceipt(txHash, props.web3);
                    checkCompleted();
                }
            });
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!guessTheNumberInstance} onClick={OnClickGuessTheNumber}>Guess the number</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && guessTheNumberInstance) {
            console.log(`guessTheNumber.checkCompleted`);
            guessTheNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`guessTheNumber.isComplete: ${err}`));
            props.web3.eth.getBalance(guessTheNumberInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`guessTheNumber.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!guessTheNumberInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the number" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
