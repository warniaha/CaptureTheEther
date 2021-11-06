import React from 'react';
import { guessTheSecretNumberAbi } from '../abi/guessthesecretnumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { toHexString } from '../utilities/hexstring';
const keccak256 = require('keccak256');

const guessTheSecretNumberContract = "0x95c844f9A79d0Bb7B25775dED3F1F0495d2e2520";

export default function GuessTheSecretNumber (props) {
    const [guessTheSecretNumberInstance, setGuessTheSecretNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && !guessTheSecretNumberInstance) {
        loadInstance(guessTheSecretNumberAbi, guessTheSecretNumberContract, setGuessTheSecretNumberInstance, props.accounts, props.web3);
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
                        else
                            alert(`Success: txHash: ${txHash}`);
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

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && guessTheSecretNumberInstance) {
                guessTheSecretNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the secret number" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
