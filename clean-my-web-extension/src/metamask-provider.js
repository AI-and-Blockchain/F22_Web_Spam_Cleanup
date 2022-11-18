import createMetaMaskProvider from 'metamask-extension-provider';
import Web3 from 'web3';

const web3Provider = createMetaMaskProvider()
const web3 = new Web3(web3Provider)

export { web3, web3Provider }