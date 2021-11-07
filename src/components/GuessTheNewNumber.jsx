import React from 'react';
import { cheatTheNewNumberAbi } from '../abi/cheathenewnumber_abi';
import { guessTheNewNumberAbi } from '../abi/guessthenewnumber_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

export default function GuessTheNewNumber (props) {
    const [guessTheNewNumberChallengeInstance, setGuessTheNewNumberChallengeInstance] = React.useState();
    const [cheatTheNewNumberInstance, setCheatTheNewNumberInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();
    const [cheatBalance, setCheatBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!guessTheNewNumberChallengeInstance)
            loadInstance(guessTheNewNumberAbi, getNetworkContract(props.networkType, "guessTheNewNumberChallengeContract"), setGuessTheNewNumberChallengeInstance, props.accounts, props.web3);
        if (!cheatTheNewNumberInstance)
            loadInstance(cheatTheNewNumberAbi, getNetworkContract(props.networkType, "cheatTheNewNumberContract"), setCheatTheNewNumberInstance, props.accounts, props.web3);
    }

    const OnClickFindTheNewNumber = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            const oneEth = props.web3.utils.toWei('1', 'ether');
            cheatTheNewNumberInstance.methods.guess().send({ from: props.accounts[0], value: oneEth }, async function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    getTransactionReceipt(txHash, props.web3);
                    checkCompleted();
                    await cheatTheNewNumberInstance.methods.withdraw().call({ from: props.accounts[0] });
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!cheatTheNewNumberInstance} onClick={OnClickFindTheNewNumber}>Guess the new number</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && cheatTheNewNumberInstance && guessTheNewNumberChallengeInstance) {
            console.log(`guessTheNewNumber.checkCompleted`);
            cheatTheNewNumberInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`guessTheNewNumber.isComplete: ${err}`));
            props.web3.eth.getBalance(guessTheNewNumberChallengeInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`guessTheNewNumber.getBalance: ${err}`));
            props.web3.eth.getBalance(cheatTheNewNumberInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setCheatBalance(wei);
            }, err => alert(`cheatTheNewNumber.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!cheatTheNewNumberInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Guess the new number" blocks="" action={getButton()} balance={balance + '/' + cheatBalance} completed={getCompleted()} />
    );
}
