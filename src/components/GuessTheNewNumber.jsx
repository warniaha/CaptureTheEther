import React from 'react';
import { cheatTheNewNumberAbi } from '../abi/cheathenewnumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import NetworkContracts from '../networkContracts';

export default function GuessTheNewNumber (props) {
    const [cheatTheNewNumberInstance, setCheatTheNewNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [cheatTheNewNumberContract, setCheatTheNewNumberContract] = React.useState();

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!cheatTheNewNumberContract)
            setCheatTheNewNumberContract(NetworkContracts.networks[network].cheatTheNewNumberContract);
        if (!cheatTheNewNumberInstance && cheatTheNewNumberContract)
            loadInstance(cheatTheNewNumberAbi, cheatTheNewNumberContract, setCheatTheNewNumberInstance, props.accounts, props.web3);
    }

    const OnClickFindTheNewNumber = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            cheatTheNewNumberInstance.methods.guess().send({ from: props.accounts[0], value: oneEth }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    alert(`Success: txHash: ${txHash}`);
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!cheatTheNewNumberInstance} onClick={OnClickFindTheNewNumber}>Guess the new number</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && cheatTheNewNumberInstance) {
                cheatTheNewNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the new number" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
