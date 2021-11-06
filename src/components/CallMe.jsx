import React from 'react';
import { callmechallengeAbi } from '../abi/callmechallenge_abi';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import NetworkContracts from '../networkContracts';

export default function CallMe(props) {
    const [callMeInstance, setCallmeInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [callMeContract, setCallMeContract] = React.useState();

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!callMeContract)
            setCallMeContract(NetworkContracts.networks[network].callMeContract);
        if (!callMeInstance && callMeContract)
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
