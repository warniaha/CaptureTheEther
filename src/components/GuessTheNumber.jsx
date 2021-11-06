import React from 'react';
import { guessTheNumberAbi } from '../abi/guessthenumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

const guessTheNumberContract = "0xa7CB2407Eb5f407C1e0ab6f5c258aaB58037E2a0";

export default function GuessTheNumber (props) {
    const [guessTheNumberInstance, setGuessTheNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && !guessTheNumberInstance) {
        loadInstance(guessTheNumberAbi, guessTheNumberContract, setGuessTheNumberInstance, props.accounts, props.web3);
    }

    const OnClickGuessTheNumber = (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            guessTheNumberInstance.methods.guess(42).send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else
                    guessTheNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            });
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (<button disabled={!guessTheNumberInstance} onClick={OnClickGuessTheNumber}>Guess the number</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && guessTheNumberInstance) {
                guessTheNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the number" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
