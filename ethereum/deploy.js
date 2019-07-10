const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledGeneral = require('./build/General.json');

const provider = new HDWalletProvider(
    //account mnemonincs
    'illegal learn ugly envelope dentist foot collect royal party repeat faint kiwi', 
    //Infura API address
    'https://rinkeby.infura.io/pgQCXbS6ygKWJEk8lKsX '
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    
    const result = await new web3.eth.Contract(JSON.parse(compiledGeneral.interface))
        .deploy({ data: compiledGeneral.bytecode })
        .send({ gas: '4000000', from: accounts[0] });
    
    console.log('Contract deployed to: ', result.options.address);
    
};
deploy();