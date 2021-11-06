import React from 'react';
import { tokenSaleChallengeAbi } from '../abi/tokensalechallenge_abi';
import { tokenSaleHelperAbi } from '../abi/tokensalehalper_abi';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import NetworkContracts from '../networkContracts';

import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

export default function TokenSale (props) {
    const [tokenSaleChallengeInstance, setTokenSaleChallengeInstance] = React.useState();
    const [tokenSaleHelperInstance, setTokenSaleHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState();
    const [tokenSaleChallengeContract, setTokenSaleChallengeContract] = React.useState(undefined);
    const [tokenSaleHelperContract, setTokenSaleHelperContract] = React.useState(undefined);

    if (props.web3 && props.accounts) {
        const network = props.networkType === 'private' ? 'development' : props.networkType;
        if (!tokenSaleChallengeContract)
            setTokenSaleChallengeContract(NetworkContracts.networks[network].tokenSaleChallengeContract);
        if (!tokenSaleHelperContract)
            setTokenSaleHelperContract(NetworkContracts.networks[network].tokenSaleHelperContract);
        if (!tokenSaleChallengeInstance && tokenSaleChallengeContract)
            loadInstance(tokenSaleChallengeAbi, tokenSaleChallengeContract, setTokenSaleChallengeInstance, props.accounts, props.web3);
        if (!tokenSaleChallengeInstance && tokenSaleHelperContract)
            loadInstance(tokenSaleHelperAbi, tokenSaleHelperContract, setTokenSaleHelperInstance, props.accounts, props.web3);
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
                    tokenSaleChallengeInstance.methods.isComplete().call().then(completed => setIsComplete(completed));
                }
            });
        }
        else
            alert(`already completed`);
    }

    const getButton = () => {
        return (<button disabled={!tokenSaleChallengeInstance && !tokenSaleHelperInstance} onClick={OnClickTokenSale}>Token sale</button>);
    }

    const getCompleted = () => {
        if (isComplete === undefined) {
            if (props.web3 && props.accounts && tokenSaleChallengeInstance) {
                tokenSaleChallengeInstance.methods.isComplete().call().then(completed => setIsComplete(completed))
            }
            return "loading";
        }
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Token sale" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
