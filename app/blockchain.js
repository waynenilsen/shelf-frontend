import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers'; // Correct import path

export async function deployContract(ethereum, abi, bytecode, ...constructorParams) {
    // Get the current provider from window.ethereum
    let provider = new Web3Provider(ethereum);
    
    // Get the signer from the provider
    let signer = provider.getSigner();

    // Create a new instance of ContractFactory
    let contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

    // Deploy the contract and pass in the constructorParams
    let contract = await contractFactory.deploy(...constructorParams);

    return contract;
}

export function createContractInstance(ethereum, abi, contractAddress) {
    // Get the current provider from window.ethereum
    let provider = new Web3Provider(ethereum);

    // Get the signer from the provider
    let signer = provider.getSigner();

    // Create a new instance of the contract
    let contractInstance = new ethers.Contract(contractAddress, abi, signer);

    return contractInstance;
}
