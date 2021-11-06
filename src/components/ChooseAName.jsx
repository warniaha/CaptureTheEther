import React from 'react';
import loadInstance from '../utilities/loadInstance';
import { captureTheEtherAbi } from '../abi/capturetheether_abi';
import CaptureRow from "./CaptureRow";
import NetworkContracts from '../networkContracts';

export default function ChooseAName (props) {
    const [pickANameInstance, setPickANameInstance] = React.useState();
    const [isComplete] = React.useState(undefined);
    const [pickANameContract, setPickANameContract] = React.useState();

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!pickANameContract)
            setPickANameContract(NetworkContracts.networks[network].pickANameContract);
        if (!pickANameInstance && pickANameContract)
            loadInstance(captureTheEtherAbi, pickANameContract, setPickANameInstance, props.accounts, props.web3);
    }

    const OnClickPickAName = (event) => {
        event.preventDefault();
        if (isComplete === false) {
            pickANameInstance.methods.setNickname(props.web3.utils.asciiToHex('walter-w')).send({ from: props.accounts[0] }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                // else
                //     pickANameInstance.methods.isComplete().call().then(completed => setIsComplete(completed))
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!pickANameInstance} onClick={OnClickPickAName}>Pick a name</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            // if (props.web3 && props.accounts && pickANameInstance) {
            //     pickANameInstance.methods.isComplete().call().then(completed => setIsComplete(completed))
            // }
            return "contract address missing";//"loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Choose a name" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}