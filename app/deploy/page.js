// pages/Deploy.js

'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Header from '@/components/Header'; // update the import path
import { BlockchainContext } from '@/components/BlockchainContext';
import styles from './page.module.css';
import { deployContract } from '../blockchain.js';

export default function Deploy() {
  const { register, handleSubmit, setValue } = useForm();
  const { account } = useContext(BlockchainContext); // add ethereum to the context

  // state for abi and bytecode
  const [abi, setAbi] = useState(null);
  const [bytecode, setBytecode] = useState(null);

  // Fetch the ABI and bytecode on component mount
  useEffect(() => {
    fetch('/solidity/TestToken.sol/TestToken.json')
      .then(response => response.json())
      .then(data => setAbi(data.abi)); // update this line if the structure is different

    fetch('/solidity/TestToken.sol/TestToken.bin')
      .then(response => response.text())
      .then(data => setBytecode(data));

  }, [account, setValue]);

  const onSubmit = async (data) => {
    console.log(data); 
  
    if(!abi || !bytecode) {
      console.error('ABI or bytecode is not loaded');
      return;
    }
  
    // Call the deployContract function with necessary parameters
    try {
      const contract = await deployContract(window.ethereum, abi, bytecode, data.name, data.symbol, Number(data.decimals));
      console.log('Contract deployed: ', contract);
  
      // Save the deployed contract address to local storage
      let deployedContracts = JSON.parse(localStorage.getItem('deployedContracts')) || [];
      deployedContracts.push(await contract.getAddress());
      localStorage.setItem('deployedContracts', JSON.stringify(deployedContracts));
    } catch (error) {
      console.error('Failed to deploy contract:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Deploy Test ERC-20 Token</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formItem}>
            <label htmlFor="symbol">Symbol</label>
            <input id="symbol" defaultValue="FOO" {...register("symbol")} />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="name">Name</label>
            <input id="name" defaultValue="FooCoin" {...register("name")} />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="decimals">Decimals</label>
            <input id="decimals" defaultValue={18} {...register("decimals")} />
          </div>

          <button className={styles.submitButton} type="submit">Deploy</button>
        </form>
      </div>
    </div>
  )
}
