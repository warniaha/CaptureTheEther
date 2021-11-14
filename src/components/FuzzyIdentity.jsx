import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
// import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { BigNumber } from 'ethers';

const fuzzyIdentityAbi = require('../abi/FuzzyIdentityChallenge.json').abi;
const secondsPerDay = 24 * 60 * 60;
const overflowedDate = BigNumber.from(`2`).pow(`256`).sub(secondsPerDay);

export default function FuzzyIdentity (props) {
    const [fuzzyIdentityInstance, setFuzzyIdentityInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!fuzzyIdentityInstance)
            loadInstance(fuzzyIdentityAbi, getNetworkContract(props.networkType, "FuzzyIdentityChallengeContract"), setFuzzyIdentityInstance, props.accounts, props.web3);
    }

    const OnClickFuzzyIdentity = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            checkCompleted();
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!fuzzyIdentityInstance} onClick={OnClickFuzzyIdentity}>FuzzyIdentity</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && fuzzyIdentityInstance) {
            console.log(`fuzzyIdentity.checkCompleted`);
            fuzzyIdentityInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`fuzzyIdentity.isComplete: ${err}`));
            props.web3.eth.getBalance(fuzzyIdentityInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`fuzzyIdentity.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!fuzzyIdentityInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="FuzzyIdentity" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
