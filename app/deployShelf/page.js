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

  // state for shelfAddress in local storage
  const [shelfAddress, setShelfAddress] = useState(null);

  // state for interestRateModelAddress in local storage
  const [interestRateModelAddress, setInterestRateModelAddress] = useState(null);

  // Fetch the ABI and bytecode on component mount
  useEffect(() => {
    fetch('/solidity/Shelf.sol/Shelf.json')
      .then(response => response.json())
      .then(data => setAbi(data.abi)); // update this line if the structure is different

    fetch('/solidity/Shelf.sol/Shelf.bin')
      .then(response => response.text())
      .then(data => setBytecode(data));

  }, [account, setValue]);

  // fetch the shelfAddress from local storage
  useEffect(() => {
    setShelfAddress(window.localStorage.getItem('shelfAddress'));
  }, []);

  // fetch the interestRateModelAddress from local storage
  useEffect(() => {
    setInterestRateModelAddress(window.localStorage.getItem('interestRateModelAddress'));
  }, []);

  const onSubmit = async (data) => {
    console.log(data); 
    if (!window) {
      return;
    }
  
    if(!abi || !bytecode) {
      console.error('ABI or bytecode is not loaded');
      return;
    }
  
    // Call the deployContract function with necessary parameters
    try {
      const contract = await deployContract(window.ethereum, abi, bytecode, Number(data.margin), data.rateModelAddr);
      console.log('Shelf contract deployed: ', contract);

      let shelfAddressUpdated = await contract.getAddress();
      setShelfAddress(shelfAddressUpdated);
      window.localStorage.setItem('shelfAddress', shelfAddress);
    } catch (error) {
      console.error('Failed to deploy contract:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Deploy Shelf</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formItem}>
            <label htmlFor="margin">Margin Requirement</label>
            <input id="margin" defaultValue="300000000" {...register("margin")} />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="rateModelAddr">Interest Rate Model Address</label>
            <input id="rateModelAddr" defaultValue={interestRateModelAddress} {...register("rateModelAddr")} />
          </div>
          <button className={styles.submitButton} type="submit">Deploy</button>
        </form>
      </div>
    </div>
  )
}
