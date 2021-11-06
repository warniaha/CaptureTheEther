import React from 'react';
import { guessTheRandomNumberAbi } from '../abi/guesstherandomnumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { fromHexString } from '../utilities/hexstring';
import NetworkContracts from '../networkContracts';

export default function GuessTheRandomNumber (props) {
    const [guessTheRandomNumberInstance, setGuessTheRandomNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [guessTheRandomNumberContract, setGuessTheRandomNumberContract] = React.useState();

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!guessTheRandomNumberContract)
            setGuessTheRandomNumberContract(NetworkContracts.networks[network].guessTheRandomNumberContract);
        if (!guessTheRandomNumberInstance && guessTheRandomNumberContract)
            loadInstance(guessTheRandomNumberAbi, guessTheRandomNumberContract, setGuessTheRandomNumberInstance, props.accounts, props.web3);
    }

    const OnClickFindTheRandomNumber = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            const firstByteString = await props.web3.eth.getStorageAt(guessTheRandomNumberContract, 0);
            const firstByte = firstByteString.substring(firstByteString.length - 2);
            const bytes = fromHexString(firstByte);
            const number = bytes[0];

            guessTheRandomNumberInstance.methods.guess(number).send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    guessTheRandomNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!guessTheRandomNumberInstance} onClick={OnClickFindTheRandomNumber}>Guess the random number</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && guessTheRandomNumberInstance) {
                guessTheRandomNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the random number" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
