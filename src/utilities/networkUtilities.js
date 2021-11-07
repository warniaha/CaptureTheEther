import NetworkContracts from '../networkContracts';

export function getNetworkName(networkType) {
    return networkType === 'private' ? 'development' : networkType;
}

export function getNetworkContract(networkType, contractName) {
    const network = getNetworkName(networkType);
    if (!network) {
        throw Object.assign(new Error(`getNetworkContract: network is null, networkType: ${networkType}`), { code: 402 });
    }
    var contractList = NetworkContracts.networks[network];
    if (!contractList) {
        throw Object.assign(new Error(`getNetworkContract: contractList is null`), { code: 402 });
    }
    if (!contractList[contractName]) {
        throw Object.assign(new Error(`getNetworkContract: contractList["${contractName}"] is null`), { code: 402 });
    }
    return contractList[contractName];
}
