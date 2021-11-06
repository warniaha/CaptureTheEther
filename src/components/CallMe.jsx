import React from 'react';
import { callmechallengeAbi } from '../abi/callmechallenge_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

const callMeContract = "0x5bf22dABEC518515887DB0838D4dDc927DaaA01A";

export default function CallMe(props) {
    const [callMeInstance, setCallmeInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && !callMeInstance) {
        loadInstance(callmechallengeAbi, callMeContract, setCallmeInstance, props.accounts, props.web3);
    }

    const OnClickCallMe = (event) => {
        event.preventDefault();
        if (!isComplete) {
            callMeInstance.methods.callme().send({ from: props.accounts[0] }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    callMeInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!callMeInstance} onClick={OnClickCallMe}>call me</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && callMeInstance) {
                callMeInstance.methods.isComplete().call().then(completed => setIsComplete(completed))
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Call me" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
