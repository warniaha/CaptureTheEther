import React from 'react';
import { guessTheNumberAbi } from '../abi/guessthenumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import NetworkContracts from '../networkContracts';

export default function GuessTheNumber (props) {
    const [guessTheNumberInstance, setGuessTheNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [guessTheNumberContract, setGuessTheNumberContract] = React.useState();

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!guessTheNumberContract)
            setGuessTheNumberContract(NetworkContracts.networks[network].guessTheNumberContract);
        if (!guessTheNumberInstance && guessTheNumberContract)
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
