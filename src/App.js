import React from 'react';
import './App.css';
// import BigNumber from "bignumber.js";

import CallMe from './components/CallMe';
import ChooseAName from './components/ChooseAName';
import GuessTheNumber from './components/GuessTheNumber';
import GuessTheSecretNumber from './components/GuessTheSecretNumber';
import GuessTheRandomNumber from './components/GuessTheRandomNumber';
import GuessTheNewNumber from './components/GuessTheNewNumber';
import PredictTheFuture from './components/PredictTheFuture';
import PredictTheBlock from './components/PredictTheBlock';
import TokenSale from './components/TokenSale';
import TokenWhale from './components/TokenWhale';

const Web3 = require("web3");

function App() {
  const [web3, setWeb3] = React.useState();
  const [accounts, setAccounts] = React.useState();
  const [accountBalance, setAccountBalance] = React.useState();
  const [networkType, setNetworkType] = React.useState();

  if (!accounts && !web3) {
    // window.ethereum will be undefined during unit tests
    if (window.ethereum) {
      window.ethereum.enable().then(accts => {
        var web3instance = new Web3(Web3.givenProvider);
        setWeb3(web3instance);
        setAccounts(accts);
        web3instance.eth.getBalance(accts[0]).then(balanceWei => {
          setAccountBalance(web3instance.utils.fromWei(balanceWei));
        });
      });
    }
  }

  React.useEffect(() => {
    if (web3 && !networkType) {
      web3.eth.net.getNetworkType().then(network => setNetworkType(network));
    }
  }, [networkType, setNetworkType, web3]);

  return (
    <div className="App">
      <header className="App-header">
        <table className="table table-primary table-borders">
          <thead>
            <tr>
              <th>Account balance</th>
              <th>Ethereum network</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {accountBalance}
              </td>
              <td>
                {networkType}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-primary table-borders">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
              <th>Blocks</th>
              <th>Balance</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            <CallMe web3={web3} accounts={accounts} networkType={networkType} />
            <ChooseAName web3={web3} accounts={accounts} networkType={networkType} />
            <GuessTheNumber web3={web3} accounts={accounts} networkType={networkType} />
            <GuessTheSecretNumber web3={web3} accounts={accounts} networkType={networkType} />
            <GuessTheRandomNumber web3={web3} accounts={accounts} networkType={networkType} />
            <GuessTheNewNumber web3={web3} accounts={accounts} networkType={networkType} />
            <PredictTheFuture web3={web3} accounts={accounts} networkType={networkType} />
            <PredictTheBlock web3={web3} accounts={accounts} networkType={networkType} />
            <TokenSale web3={web3} accounts={accounts} networkType={networkType} />
            <TokenWhale web3={web3} accounts={accounts} networkType={networkType} />
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
