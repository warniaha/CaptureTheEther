const fs = require('fs');
var path = require('path');

module.exports = async function (deployer, network, accounts) {
    const contractsFolder = './build/contracts';
    const targetFolder = './src/abi';
    const files = fs.readdirSync(contractsFolder);
    files.map(file => {
        const source = path.join(contractsFolder, file);
        const target = path.join(targetFolder, file);
        console.log(`Copying ${source} to ${target}...`);
        return fs.copyFileSync(source, target);
    });
}
