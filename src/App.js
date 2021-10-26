import React from 'react';
import './App.css';
import { callmechallengeAbi } from './abi/callmechallenge_abi';
import { nicknameChallengeAbi, captureTheEtherAbi } from './abi/capturetheether_abi';
import { guessTheNumberAbi } from './abi/guessthenumber_abi';
import { guessTheSecretNumberAbi } from './abi/guessthesecretnumber_abi';

const keccak256 = require('keccak256');
const Web3 = require("web3");
const oneEth = Web3.utils.toWei('1', 'ether');

function getTransactionReceiptMined(txHash, interval) {
  const self = this;
  const transactionReceiptAsync = function(resolve, reject) {
      self.getTransactionReceipt(txHash, (error, receipt) => {
          if (error) {
              reject(error);
          } else if (receipt == null) {
              setTimeout(
                  () => transactionReceiptAsync(resolve, reject),
                  interval ? interval : 500);
          } else {
              resolve(receipt);
          }
      });
  };

  if (Array.isArray(txHash)) {
      return Promise.all(txHash.map(
          oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
  } else if (typeof txHash === "string") {
      return new Promise(transactionReceiptAsync);
  } else {
      throw new Error("Invalid Type: " + txHash);
  }
};

function App() {
  const [accounts, setAccounts] = React.useState();
  const [callmeInstance, setCallmeInstance] = React.useState();
  const [captureTheEtherInstance, setCaptureTheEtherInstance] = React.useState();
  const [guessTheNumberInstance, setGuessTheNumberInstance] = React.useState();
  const [guessTheSecretNumberInstance, setGuessTheSecretNumberInstance] = React.useState();

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

  const callmeContract = "0x5bf22dABEC518515887DB0838D4dDc927DaaA01A";
  const captureTheEhterContract = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";
  const guessTheNumberContract = "0xa7CB2407Eb5f407C1e0ab6f5c258aaB58037E2a0";
  const guessTheSecretNumberContract = "0x95c844f9A79d0Bb7B25775dED3F1F0495d2e2520";

  if (!accounts) {
    // window.ethereum will be undefined during unit tests
    if (window.ethereum) {
      window.ethereum.enable().then(accts => {
        setAccounts(accts);
        var web3 = new Web3(Web3.givenProvider);
        const callMeInstance = new web3.eth.Contract(callmechallengeAbi, callmeContract, { from: accts[0] });
        setCallmeInstance(callMeInstance);
        const nicknameInstance = new web3.eth.Contract(captureTheEtherAbi, captureTheEhterContract, { from: accts[0] });
        setCaptureTheEtherInstance(nicknameInstance);
        const guessNumberInstance = new web3.eth.Contract(guessTheNumberAbi, guessTheNumberContract, { from: accts[0] });
        setGuessTheNumberInstance(guessNumberInstance);
        const guessSecretNumberInstance = new web3.eth.Contract(guessTheSecretNumberAbi, guessTheSecretNumberContract, { from: accts[0] });
        setGuessTheSecretNumberInstance(guessSecretNumberInstance);
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button disabled={!callmeInstance} onClick={OnClickCallMe}>call me</button>
        <button disabled={!captureTheEtherInstance} onClick={OnClickNickname}>Set nickname</button>
        <button disabled={!guessTheNumberInstance} onClick={OnClickGuessTheNumber}>Guess the number</button>
        <button onClick={onClickFindNumber}>Find the secret number</button>
      </header>
    </div>
  );
}

export default App;
