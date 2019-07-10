import web3 from './web3';
import General from './build/General.json';

const instance = new web3.eth.Contract(
  JSON.parse(General.interface),
  '0x3C22BEf6bcf41BFD7B4E40b0dDb1900Ba0e165Ac' //address
);

export default instance;