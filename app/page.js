// Mint.js
'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; 
import { BlockchainContext } from '@/components/BlockchainContext';
import styles from './page.module.css';
import { createContractInstance } from './blockchain.js';
import {ethers} from 'ethers';

export default function Shelf() {
  const { register, handleSubmit, setValue } = useForm();
  const { account } = useContext(BlockchainContext);
  const router = useRouter();

  const [abi, setAbi] = useState(null);
  const [deployedContracts, setDeployedContracts] = useState([]);

  useEffect(() => {
    fetch('/solidity/Shelf.sol/Shelf.json')
      .then(response => response.json())
      .then(data => setAbi(data.abi));
      
    if(account) {
      setValue("_user", account);
    }

    const contracts = JSON.parse(localStorage.getItem('deployedContracts')) || [];
    setDeployedContracts(contracts);
  }, [account, setValue]);

  const createOnSubmit = (index) => {
    return async (data) => {
      console.log(data);
  
      if(!abi) {
        console.error('ABI is not loaded');
        return;
      }
  
      const shelfAddress = localStorage.getItem('shelfAddress');
      if (!shelfAddress) {
        console.error('Shelf address is not set');
        return;
      }
  
  
      try {
        const contractInstance = createContractInstance(window.ethereum, abi, shelfAddress);
  
        // look up the abi data by function name
        const abiElement = abi[index];
        if (!abiElement) {
          console.error('ABI element not found', index);
          return;
        }
        console.log('abiElement', abiElement);
  
        // carefully arrange the input array based on abi input parameter order and the values from the form
        const args = [];
        for (let i = 0; i < abiElement.inputs.length; i++) {
          const input = abiElement.inputs[i];
          const formData = data[`${index}/${i}`];
          if (!formData) {
            console.error('Form data not found', input.name, 'for function', abiElement.name);
            return;
          }
          args.push(formData);
        }
        
        // call the function
        const tx = await contractInstance[abiElement.name](...args);
        console.log('tx', tx);
      } catch (error) {
        console.error('Failed to call function:', error);
      }
    };
  }

  const createFormInputField = (abiInputParam, funcIndex, argIndex) => {
    const key = `${funcIndex}/${argIndex}`;
    // if the name is _token then we want to populate that from deployedContracts
    if (abiInputParam.name === '_token') {
      return (
        <select id={key} {...register(key)}>
          {deployedContracts.map((address, index) => <option key={index} value={address}>{address}</option>)}
        </select>
      )
    } else if(abiInputParam.name == '_user') {
      // default to the current account
      return <input id={key} defaultValue={account} {...register(key)} />;
    } else if (abiInputParam.name === '_tokenToChange') {
      return <input id={key} defaultValue={ethers.ZeroAddress} {...register(key)} />;
    } else if (abiInputParam.name === '_amountToChange') {
      return <input id={key} defaultValue={0} {...register(key)} />;
    } else {
      return <input id={abiInputParam.name} {...register(key)} />;
    }
  }

  const createFormItem = (abiInputParam, funcIndex, argIndex) => {
    if (!abiInputParam.name) {
      return null;
    }

    const key = `${funcIndex}/${argIndex}`;
    return (
      <div className={styles.formItem} key={key}>
        <label htmlFor={key}>{abiInputParam.name}</label>
        { createFormInputField(abiInputParam, funcIndex, argIndex) }
      </div>
    )
  }

  const createAllFormItems = (abiInputs, funcIndex) => {
    return abiInputs
      .map((abiInputParam, index) => createFormItem(abiInputParam, funcIndex, index));
  }

  const createSubForm = (abiElement, index) => {
    if (!abiElement.name) {
      return null;
    }
    if (abiElement.type !== 'function') {
      return null;
    }

    return (
        <div className={styles.formContainer} key={index}>
          <h2 className={styles.title}> Call {abiElement.name} </h2>
            <form onSubmit={handleSubmit(createOnSubmit(index))}>
              { createAllFormItems(abiElement.inputs, index) }
              <button className={styles.submitButton} type="submit">Execute</button>
            </form>
        </div>
    )
  }

  const createAllForms = (abiElements) => {
    return abiElements
      .map((abiElement, index) => createSubForm(abiElement, index));
  }
  

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Header />
      {abi ? createAllForms(abi) : null}
    </div>
  )
}
