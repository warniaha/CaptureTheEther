import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const retirementFundAbi = require('../abi/RetirementFundChallenge.json').abi;

export default function RetirementFund (props) {
    const [retirementFundInstance, setRetirementFundInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!retirementFundInstance)
            loadInstance(retirementFundAbi, getNetworkContract(props.networkType, "RetirementFundChallengeContract"), setRetirementFundInstance, props.accounts, props.web3);
    }

    const OnClickRetirementFund = (event) => {
        event.preventDefault();
        if (!isComplete) {
            retirementFundInstance.methods.collectPenalty().send({ from: props.accounts[0] }, function (error, txHash) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else
                {
                    getTransactionReceipt(txHash, props.web3);
                    checkCompleted();
                }
            });
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!retirementFundInstance} onClick={OnClickRetirementFund}>Retirement fund</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && retirementFundInstance) {
            console.log(`retirementFund.checkCompleted`);
            retirementFundInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`retirementFund.isComplete: ${err}`));
            props.web3.eth.getBalance(retirementFundInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`retirementFund.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!retirementFundInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Retirement Fund" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
