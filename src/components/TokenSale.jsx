import React from 'react';
import { tokenSaleChallengeAbi } from '../abi/tokensalechallenge_abi';
import { tokenSaleHelperAbi } from '../abi/tokensalehalper_abi';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { getNetworkContract } from '../utilities/networkUtilities';

import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

export default function TokenSale (props) {
    const [tokenSaleChallengeInstance, setTokenSaleChallengeInstance] = React.useState();
    const [tokenSaleHelperInstance, setTokenSaleHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!tokenSaleChallengeInstance)
            loadInstance(tokenSaleChallengeAbi, getNetworkContract(props.networkType, "tokenSaleChallengeContract"), setTokenSaleChallengeInstance, props.accounts, props.web3);
        if (!tokenSaleChallengeInstance)
            loadInstance(tokenSaleHelperAbi, getNetworkContract(props.networkType, "tokenSaleHelperContract"), setTokenSaleHelperInstance, props.accounts, props.web3);
    }

    const OnClickTokenSale = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            debugger;
            var oneEth = props.web3.utils.toWei('1', 'ether');
            tokenSaleHelperInstance.methods.buy().send( { from: props.accounts[0], value: oneEth }, function (error, txBuy) {
                if (error)
                    alert(`Failed: ${error.message}`);
                else {
                    getTransactionReceipt(txBuy, props.web3);
                    checkCompleted();
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!tokenSaleChallengeInstance && !tokenSaleHelperInstance} onClick={OnClickTokenSale}>Token sale</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && tokenSaleChallengeInstance) {
            console.log(`tokenSale.checkCompleted`);
            tokenSaleChallengeInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`tokenSale.isComplete: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!tokenSaleChallengeInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Token sale" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
