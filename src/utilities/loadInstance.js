export default function loadInstance(abi, contract, setter, accts, web3instance) {
    const instance = new web3instance.eth.Contract(abi, contract, { from: accts[0] });
    setter(instance);
    return instance;
}
