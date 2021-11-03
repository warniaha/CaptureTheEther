import React from 'react';
import './App.css';
// import BigNumber from "bignumber.js";

// guess the random number: tx: https://ropsten.etherscan.io/tx/0x492ed915b11543fe8bc65c4ace01a84f64a0d51abb5498b7e85cb0b4417b5c12

import { callmechallengeAbi } from './abi/callmechallenge_abi';
import { captureTheEtherAbi } from './abi/capturetheether_abi';
import { guessTheNumberAbi } from './abi/guessthenumber_abi';
import { guessTheSecretNumberAbi } from './abi/guessthesecretnumber_abi';
import { guessTheRandomNumberAbi } from './abi/guesstherandomnumber_abi';
import { cheatTheNewNumberAbi } from './abi/cheathenewnumber_abi';
import { predictTheFutureChallengeAbi } from './abi/predictthefuturechallenge_abi';
import { predictHelperAbi } from './abi/predicthelper_abi';
import { predictTheBlockHashAbi } from './abi/predicttheblockhashchallenge_abi';
import { predictHashHelperAbi } from './abi/predicthashhelper_abi'

// const callmechallengeAbi = require('../build/contracts/CallMeChallenge.json').abi;
// const nicknameChallengeAbi = require('../build/contracts/NicknameChallenge.json').abi;
// const captureTheEtherAbi = require('../build/contracts/CaptureTheEther.json').abi;
// const guessTheNumberAbi = require('../build/contracts/GuessTheNumberChallenge.json').abi;
// const guessTheSecretNumberAbi = require('../build/contracts/GuessTheSecretNumberChallenge.json').abi;
// const guessTheRandomNumberAbi = require('../build/contracts/GuessTheRandomNumberChallenge.json').abi;

const keccak256 = require('keccak256');
const Web3 = require("web3");
const oneEth = Web3.utils.toWei('1', 'ether');

function App() {
  const [web3, setWeb3] = React.useState();
  const [accounts, setAccounts] = React.useState();
  const [callmeInstance, setCallmeInstance] = React.useState();
  const [captureTheEtherInstance, setCaptureTheEtherInstance] = React.useState();
  const [guessTheNumberInstance, setGuessTheNumberInstance] = React.useState();
  const [guessTheSecretNumberInstance, setGuessTheSecretNumberInstance] = React.useState();
  const [guessTheRandomNumberInstance, setGuessTheRandomNumberInstance] = React.useState();
  const [cheatTheNewNumberInstance, setCheatTheNewNumberInstance] = React.useState();
  const [predictTheFutureChallengeInstance, setPredictTheFutureChallengeInstance] = React.useState();
  const [predictHelperInstance, setPredictHelperInstance] = React.useState();

  const [predictTheBlockHashInstance, setPredictTheBlockHashInstance] = React.useState();
  const [predictHashHelperInstance, setPredictHashHelperInstance] = React.useState();
  const [blockHashBalance, setBlockHashBalance] = React.useState(0);
  const [blockHashCompleted, setBlockHashCompleted] = React.useState(false);
  const [blockNumberHashRunning, setBlockNumberHashRunning] = React.useState(false);
  const [blockNumberCurrent, setBlockNumberCurrent] = React.useState();
  const [blockNumberTarget, setBlockNumberTarget] = React.useState();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // const getTransactionReceipt = async (transactonHash) => {
  //   var transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
  //   const expectedBlockTime = 1000; // in ms
  //   while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
  //     await sleep(expectedBlockTime)
  //     transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
  //   }
  //   return transactionReceipt;
  // }
  
  const OnClickCallMe = (event) => {
    event.preventDefault();
    callmeInstance.methods.callme().send({ from: accounts[0] }, function (error, txHash) {
      if (error)
        alert(`Failed: ${error.message}`);
      else
        alert(`Success: txHash: ${txHash}`);
    });
  }

  const OnClickNickname = (event) => {
    event.preventDefault();
    captureTheEtherInstance.methods.setNickname(Web3.utils.asciiToHex('walter-w')).send({ from: accounts[0] }, function (error, txHash) {
      if (error)
        alert(`Failed: ${error.message}`);
      else
        alert(`Success: txHash: ${txHash}`);
    });
  }

  const fromHexString = (hexString) =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  const toHexString = (bytes) =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

  const onClickFindNumber = () => {
    const answerHash = "db81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
    var secretNumber = undefined;
    for (var loop = 0; loop < 256; loop++) {
      var testHash = toHexString(keccak256(loop));
      if (testHash.toLowerCase() === answerHash.toLowerCase()) {
        secretNumber = loop;
        guessTheSecretNumberInstance.methods.guess(loop).send({ from: accounts[0], value: oneEth }, function (error, txHash) {
          if (error)
          alert(`Failed: ${error.message}`);
        else
          alert(`Success: txHash: ${txHash}`);
      });
      }
    }
    if (secretNumber === undefined)
      alert("No number matches the answerHash?");
  }

  const OnClickGuessTheNumber = (event) => {
    event.preventDefault();
    guessTheNumberInstance.methods.guess(42).send({ from: accounts[0], value: oneEth }, function (error, txHash) {
      if (error)
        alert(`Failed: ${error.message}`);
      else
        alert(`Success: txHash: ${txHash}`);
    });
  }

  const OnClickFindTheRandomNumber = async (event) => {
    event.preventDefault();
    const firstByteString = await web3.eth.getStorageAt(guessTheRandomNumberContract, 0);
    const firstByte = firstByteString.substring(firstByteString.length-2);
    const bytes = fromHexString(firstByte);
    const number = bytes[0];

    guessTheRandomNumberInstance.methods.guess(number).send({ from: accounts[0], value: oneEth }, function (error, txHash) {
      if (error)
        alert(`Failed: ${error.message}`);
      else
      {
        alert(`Success: txHash: ${txHash}`);
      }
    });
  }

  const OnClickFindTheNewNumber = async (event) => {
    event.preventDefault();
    cheatTheNewNumberInstance.methods.guess().send({ from: accounts[0], value: oneEth }, function (error, txHash) {
      if (error)
        alert(`Failed: ${error.message}`);
      else
      {
        alert(`Success: txHash: ${txHash}`);
      }
    });
  }

  const waitForNextBlockNumber = async () => {
    var block = await web3.eth.getBlockNumber();
    var nextBlock = block;
    while (block === nextBlock) {
      await sleep(500);
      nextBlock = await web3.eth.getBlockNumber();
    }
    console.log(`block: ${block} nextBlock: ${nextBlock}`);
  }

  const OnClickPredictTheFuture = async (event) => {
    event.preventDefault();
    await waitForNextBlockNumber();
    var blockNumTarget = await web3.eth.getBlockNumber() + 2;
    var answer = await predictHelperInstance.methods.getAnswer(blockNumTarget).call({from: accounts[0]});
    await predictTheFutureChallengeInstance.methods.lockInGuess(answer).send({from: accounts[0], value: oneEth});
    var blockNumCurrent = await web3.eth.getBlockNumber();
    while (blockNumCurrent < blockNumTarget) {
        await sleep(500);
        blockNumCurrent = await web3.eth.getBlockNumber();
    }
    await predictTheFutureChallengeInstance.methods.settle().send({from: accounts[0]});
    var completed = await predictTheFutureChallengeInstance.methods.isComplete().call({from: accounts[0]});
    alert(completed ? `OnClickPredictTheFuture Success` : `OnClickPredictTheFuture Failed`);
  }

  const OnClickPredictTheBlockHash = async (event) => {
    event.preventDefault();
    debugger;
    await predictHashHelperInstance.methods.setPredictTheBlockHashChallengeContract(predictTheBlockHashContract).call({from: accounts[0]});
    var blockNumber = await web3.eth.getBlockNumber() + 264;
    setBlockNumberTarget(blockNumber);
    var answer = '0x0000000000000000000000000000000000000000000000000000000000000000';
    await predictHashHelperInstance.methods.lockInGuess(answer).send({from: accounts[0], value: oneEth});
    setBlockNumberCurrent(await web3.eth.getBlockNumber());
    setBlockNumberHashRunning(true);
  }

  const runBlockHash = React.useCallback( async () => {
    if (blockNumberCurrent > blockNumberTarget) {
      setBlockNumberHashRunning(false);
      debugger;
      await predictHashHelperInstance.methods.settle().send({from: accounts[0]});
      var completed = await predictTheBlockHashInstance.methods.isComplete().call({from: accounts[0]});
      alert(completed ? `PredictTheBlockHash Failed` : `PredictTheBlockHash Success`);
      await predictHashHelperInstance.methods.withdraw().call({from: accounts[0]});
    }
    else
      setBlockNumberCurrent(await web3.eth.getBlockNumber());
  }, [blockNumberCurrent, blockNumberTarget, predictTheBlockHashInstance, setBlockNumberHashRunning, accounts,
      web3, setBlockNumberCurrent, predictHashHelperInstance]
  );

  const getBlockHashBalance = React.useCallback( async () => {
    if (web3 && predictTheBlockHashInstance) {
      web3.eth.getBalance(predictTheBlockHashInstance._address).then(balance => {
        var wei = web3.utils.fromWei(balance);
        setBlockHashBalance(wei);
      });
      await predictTheBlockHashInstance.methods.isComplete().call({from: accounts[0]}).then(completed => {
        setBlockHashCompleted(completed);
      })
    }
  }, [setBlockHashBalance, setBlockHashCompleted, web3, predictTheBlockHashInstance, accounts]);
/*
  const [blockHashBalance, setBlockHashBalance] = React.useState(0);
*/
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (blockNumberHashRunning)
        runBlockHash();
      getBlockHashBalance();
  }, 500);
  return () => clearInterval(interval);
  }, [blockNumberHashRunning, runBlockHash, getBlockHashBalance]);

  const callmeContract = "0x5bf22dABEC518515887DB0838D4dDc927DaaA01A";
  const captureTheEhterContract = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";
  const guessTheNumberContract = "0xa7CB2407Eb5f407C1e0ab6f5c258aaB58037E2a0";
  const guessTheSecretNumberContract = "0x95c844f9A79d0Bb7B25775dED3F1F0495d2e2520";
  const guessTheRandomNumberContract = "0x822E9f799B02d791Bb0F65A0E527805ECe101b53";
  const cheatTheNewNumberContract = "0x822d23bB6f6839FFb44B1dfF461e8D78dEBb665b";
  const predictTheFutureChallengeContract = "0xE1AC1173355144d93b66d2f93585dE9179a7e810";
  const predictHelperContract = "0x1c4AD0Fa9fC21ff6Bd3F613e446b7040a9e5Fe26";
  const predictTheBlockHashContract = "0x1E2d073a901e54A5e0152AddFE3F69B6A86e4286";
  const predictHashHelperContract = "0x7F7D37aacc9E585891E4C4FFf3F55920039cF81a";

  const loadInstance = (abi, contract, setter, accts, web3instance) => {
    const instance = new web3instance.eth.Contract(abi, contract, { from: accts[0] });
    setter(instance);
  }

  if (!accounts) {
    // window.ethereum will be undefined during unit tests
    if (window.ethereum) {
      window.ethereum.enable().then(accts => {
        var web3instance = new Web3(Web3.givenProvider);
        setWeb3(web3instance);
        setAccounts(accts);
        loadInstance(callmechallengeAbi, callmeContract, setCallmeInstance, accts, web3instance);
        loadInstance(captureTheEtherAbi, captureTheEhterContract, setCaptureTheEtherInstance, accts, web3instance);
        loadInstance(guessTheNumberAbi, guessTheNumberContract, setGuessTheNumberInstance, accts, web3instance);
        loadInstance(guessTheSecretNumberAbi, guessTheSecretNumberContract, setGuessTheSecretNumberInstance, accts, web3instance);
        loadInstance(guessTheRandomNumberAbi, guessTheRandomNumberContract, setGuessTheRandomNumberInstance, accts, web3instance);
        loadInstance(cheatTheNewNumberAbi, cheatTheNewNumberContract, setCheatTheNewNumberInstance, accts, web3instance);
        loadInstance(predictTheFutureChallengeAbi, predictTheFutureChallengeContract, setPredictTheFutureChallengeInstance, accts, web3instance);
        loadInstance(predictHelperAbi, predictHelperContract, setPredictHelperInstance, accts, web3instance);
        loadInstance(predictTheBlockHashAbi, predictTheBlockHashContract, setPredictTheBlockHashInstance, accts, web3instance);
        loadInstance(predictHashHelperAbi, predictHashHelperContract, setPredictHashHelperInstance, accts, web3instance);
      });
    }
  }

  const getBlockNumberHashView = () => {
    if (blockNumberHashRunning) {
      return (
        <div>Waiting for {blockNumberTarget - blockNumberCurrent} blocks to settle</div>
      );
    }
    return (<></>);
  }

  const blockHashButtonEnabled = () => {
    return predictTheBlockHashInstance && predictHashHelperInstance && !blockNumberHashRunning;
  }

  const getBlockHashBalanceView = () => {
    return (
      <div> Balance: {blockHashBalance} Eth - Completed: {blockHashCompleted ? "yes" : "no"}</div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button disabled={!callmeInstance} onClick={OnClickCallMe}>call me</button>
        <button disabled={!captureTheEtherInstance} onClick={OnClickNickname}>Set nickname</button>
        <button disabled={!guessTheNumberInstance} onClick={OnClickGuessTheNumber}>Guess the number</button>
        <button disabled={!guessTheSecretNumberInstance} onClick={onClickFindNumber}>Find the secret number</button>
        <button disabled={!guessTheRandomNumberInstance} onClick={OnClickFindTheRandomNumber}>Find the random number</button>
        <button disabled={!cheatTheNewNumberInstance} onClick={OnClickFindTheNewNumber}>Find the new number</button>
        <button disabled={!predictTheFutureChallengeInstance && !predictHelperInstance} onClick={OnClickPredictTheFuture}>Predict the future</button>
        <div className='blockNumber'>
          <button disabled={!blockHashButtonEnabled} onClick={OnClickPredictTheBlockHash}>Predict The Block Hash</button>
          {getBlockNumberHashView()}
          {getBlockHashBalanceView()}
        </div>
      </header>
    </div>
  );
}

export default App;
