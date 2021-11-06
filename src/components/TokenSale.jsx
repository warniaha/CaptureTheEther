import React from 'react';
import { tokenSaleChallengeAbi } from '../abi/tokensalechallenge_abi';
import { tokenSaleHelperAbi } from '../abi/tokensalehalper_abi';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

const tokenSaleChallengeContract = "0x08e2E9275D6b0C546d9a42a63567a6De6Aeb5B80";
const tokenSaleHelperContract = "0xecc714609595Ac001d55a1842397a485963Ff21d";

export default function TokenSale (props) {
    const [tokenSaleChallengeInstance, setTokenSaleChallengeInstance] = React.useState();
    const [tokenSaleHelperInstance, setTokenSaleHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts) {
        if (!tokenSaleChallengeInstance)
            loadInstance(tokenSaleChallengeAbi, tokenSaleChallengeContract, setTokenSaleChallengeInstance, props.accounts, props.web3);
        if (!tokenSaleChallengeInstance)
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
