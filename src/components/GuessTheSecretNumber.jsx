import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { toHexString } from '../utilities/hexstring';
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const guessTheSecretNumberAbi = require('../abi/GuessTheSecretNumberChallenge.json').abi;
const keccak256 = require('keccak256');

export default function GuessTheSecretNumber (props) {
    const [guessTheSecretNumberInstance, setGuessTheSecretNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!guessTheSecretNumberInstance)
            loadInstance(guessTheSecretNumberAbi, getNetworkContract(props.networkType, "guessTheSecretNumberChallengeContract"), setGuessTheSecretNumberInstance, props.accounts, props.web3);
    }

    const onClickFindNumber = () => {
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            const answerHash = "db81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
            var secretNumber = undefined;
            for (var loop = 0; loop < 256; loop++) {
                var testHash = toHexString(keccak256(loop));
                if (testHash.toLowerCase() === answerHash.toLowerCase()) {
                    secretNumber = loop;
                    guessTheSecretNumberInstance.methods.guess(loop).send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                        if (error)
                            alert(`Failed: ${error.message}`);
                        else {
                            getTransactionReceipt(txHash, props.web3);
                            checkCompleted();
                        }
                    });
                }
            }
            if (secretNumber === undefined)
                alert("No number matches the answerHash?");
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!guessTheSecretNumberInstance} onClick={onClickFindNumber}>Guess the secret number</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && guessTheSecretNumberInstance) {
            console.log(`guessTheSecretNumber.checkCompleted`);
            guessTheSecretNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`guessTheSecretNumber.isComplete: ${err}`));
            props.web3.eth.getBalance(guessTheSecretNumberInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`guessTheSecretNumber.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!guessTheSecretNumberInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the secret number" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
