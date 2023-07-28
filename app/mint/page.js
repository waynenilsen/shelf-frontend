// Mint.js
'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; 
import { BlockchainContext } from '@/components/BlockchainContext';
import styles from './page.module.css';
import { createContractInstance } from '../blockchain.js';
import {ethers} from 'ethers';

export default function Mint() {
  const { register, handleSubmit, setValue } = useForm();
  const { account } = useContext(BlockchainContext);
  const router = useRouter();

  const [abi, setAbi] = useState(null);
  const [deployedContracts, setDeployedContracts] = useState([]);

  useEffect(() => {
    fetch('/solidity/TestToken.sol/TestToken.json')
      .then(response => response.json())
      .then(data => setAbi(data.abi));
      
    if(account) {
      setValue("mintDestination", account);
    }

    const contracts = JSON.parse(localStorage.getItem('deployedContracts')) || [];
    setDeployedContracts(contracts);
  }, [account, setValue]);

  const onSubmit = async (data) => {
    console.log(data);

    if(!abi) {
      console.error('ABI is not loaded');
      return;
    }

    try {
      const contractInstance = createContractInstance(window.ethereum, abi, data.contractAddress);
      
      // Call the mint function of the contract
      // todo: upgrade contract storage to store more information including name symbol and decimals
      const tx = await contractInstance.mint(data.mintDestination, ethers.parseUnits(data.numberOfTokens, 'wei'));
      // await tx.wait();
    } catch (error) {
      console.error('Failed to mint tokens:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Header />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Mint Test Tokens</h2>
        {deployedContracts.length > 0 ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Add form fields */}
            <div className={styles.formItem}>
              <label htmlFor="contractAddress">Contract Address</label>
              <select id="contractAddress" {...register("contractAddress")}>
                {deployedContracts.map((address, index) => <option key={index} value={address}>{address}</option>)}
              </select>
            </div>

            <div className={styles.formItem}>
              <label htmlFor="mintDestination">Mint Destination</label>
              <input id="mintDestination" defaultValue={account} {...register("mintDestination")} />
            </div>

            <div className={styles.formItem}>
              <label htmlFor="numberOfTokens">Number Of Tokens</label>
              <input id="numberOfTokens" defaultValue={1000} {...register("numberOfTokens")} />
            </div>

            <button className={styles.submitButton} type="submit">Mint</button>
          </form>
        ) : (
          <div>
            <p>No contracts deployed yet.</p>
            <button className={styles.submitButton} onClick={() => router.push('/deploy')}>No Contracts, Deploy first</button>
          </div>
        )}
      </div>
    </div>
  )
}
