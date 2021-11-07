import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const callmechallengeAbi = require('../abi/CallMeChallenge.json').abi;

export default function CallMe(props) {
    const [callMeInstance, setCallmeInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && props.networkType) {
        if (!callMeInstance)
            loadInstance(callmechallengeAbi, getNetworkContract(props.networkType, "callMeChallengeContract"), setCallmeInstance, props.accounts, props.web3);
    }

    const OnClickCallMe = (event) => {
        event.preventDefault();
        if (!isComplete) {
            callMeInstance.methods.callme().send({ from: props.accounts[0] }, function (error, txHash) {
                debugger;
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

    const checkCompleted = () => {
        if (props.web3 && callMeInstance) {
            console.log(`CallMe.checkCompleted`);
            callMeInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`callMe.isComplete: ${err}`));
        }
    }

    const getButton = () => {
        return (<button disabled={!callMeInstance} onClick={OnClickCallMe}>call me</button>);
    }

    const getCompleted = () => {
        if (!callMeInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Call me" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
