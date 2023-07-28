// pages/Deploy.js

'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Header from '@/components/Header'; // update the import path
import { BlockchainContext } from '@/components/BlockchainContext';
import styles from './page.module.css';
import { deployContract } from '../blockchain.js';

export default function DeployShelf() {
  const { register, handleSubmit, setValue } = useForm();
  const { account } = useContext(BlockchainContext); // add ethereum to the context

  // state for abi and bytecode
  const [abi, setAbi] = useState(null);
  const [bytecode, setBytecode] = useState(null);

  // Fetch the ABI and bytecode on component mount
  useEffect(() => {
    fetch('/solidity/InterestRateModel.sol/InterestRateModelConstantImpl.json')
      .then(response => response.json())
      .then(data => setAbi(data.abi)); // update this line if the structure is different

    fetch('/solidity/InterestRateModel.sol/InterestRateModelConstantImpl.bin')
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
      const contract = await deployContract(window.ethereum, abi, bytecode);
      console.log('Contract deployed: ', contract);

      let interestRateModelAddress = await contract.getAddress();
      localStorage.setItem('interestRateModelAddress', interestRateModelAddress);
    } catch (error) {
      console.error('Failed to deploy contract:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Deploy Interest Rate Model</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <button className={styles.submitButton} type="submit">Deploy</button>
        </form>
      </div>
    </div>
  )
}
