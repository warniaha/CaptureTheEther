import React from 'react';
import loadInstance from '../utilities/loadInstance';
import { captureTheEtherAbi } from '../abi/capturetheether_abi';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

export default function ChooseAName (props) {
    const [pickANameInstance, setPickANameInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && props.networkType) {
        if (!pickANameInstance) {
            loadInstance(captureTheEtherAbi, getNetworkContract(props.networkType, "captureTheEtherContract"), setPickANameInstance, props.accounts, props.web3);
        }
    }

    const OnClickPickAName = (event) => {
        event.preventDefault();
        if (isComplete === false) {
            pickANameInstance.methods.setNickname(props.web3.utils.asciiToHex('walter-w')).send({ from: props.accounts[0] }, function (error, txHash) {
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

    const getButton = () => {
        return (<button disabled={!pickANameInstance} onClick={OnClickPickAName}>Pick a name</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && pickANameInstance) {
            pickANameInstance.methods.nicknameOf(props.accounts[0]).call().then(completed => setIsComplete(completed), 
                err => alert(`chooseAName.isComplete: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!pickANameInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Choose a name" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
