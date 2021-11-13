import React from 'react';
import loadInstance from '../utilities/loadInstance';
import CaptureRow from "./CaptureRow";
import { getNetworkContract } from '../utilities/networkUtilities';
import { BigNumber } from 'ethers';
import { getTransactionReceipt } from '../utilities/getTransactionReceipt';

const mappingAbi = require('../abi/MappingChallenge.json').abi;

export default function Mapping (props) {
    const [mappingInstance, setMappingInstance] = React.useState();
    const [isComplete, setIsComplete] = React.useState(undefined);

    if (props.web3 && props.accounts && props.networkType) {
        if (!mappingInstance)
            loadInstance(mappingAbi, getNetworkContract(props.networkType, "MappingChallengeContract"), setMappingInstance, props.accounts, props.web3);
    }

    const overriteIsCompleted = (isCompleteIndex) => {
        mappingInstance.methods.set(isCompleteIndex, '1').send({ from: props.accounts[0] }, function (error, txHash) {
            if (error)
                alert(`Failed setting wrap-around isComplete: ${error.message}`);
            else
            {
                getTransactionReceipt(txHash, props.web3);
                checkCompleted();
            }
        });
    }

    const OnClickMapping = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            debugger;
            const keccakValue = BigNumber.from(props.web3.utils.keccak256(`0x0000000000000000000000000000000000000000000000000000000000000001`));
            const hugeIndex = BigNumber.from("2").pow("256").sub("2");
            const isCompleteIndex = BigNumber.from(`2`).pow(`256`).sub(keccakValue);
            const hugeIndexvalue = 1;//await mappingInstance.methods.get(hugeIndex).call({ from: props.accounts[0] });
            if (hugeIndexvalue !== '1') {
                mappingInstance.methods.set(hugeIndex, '1').send({ from: props.accounts[0] }, function (error, txHash) {
                    if (error)
                        alert(`Failed setting huge undex: ${error.message}`);
                    else
                    {
                        getTransactionReceipt(txHash, props.web3);
                        overriteIsCompleted(isCompleteIndex);
                    }
                });
            }
            else {
                overriteIsCompleted(isCompleteIndex);
            }
        }
        else
            alert(`already completed`)
    }

    const getButton = () => {
        return (
            <>
                <button disabled={!mappingInstance} onClick={OnClickMapping}>Mapping</button>
            </>
        );
    }

    const checkCompleted = () => {
        if (props.web3 && props.accounts && mappingInstance) {
            console.log(`mapping.checkCompleted`);
            mappingInstance.methods.isComplete().call().then(completed => setIsComplete(completed), 
                err => alert(`mapping.isComplete: ${err}`));
        }
    }

    const getCompleted = () => {
        if (!mappingInstance) {
            return "loading";
        }
        checkCompleted();
        return isComplete ? "true" : "false";
    }

    return (
        <CaptureRow name="Mapping" blocks="" action={getButton()} balance="" completed={getCompleted()} />
    );
}
