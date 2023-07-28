'use client';

import { createContext, useState, useCallback, useEffect } from 'react';

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const handleAccountsChanged = useCallback((accounts) => {
    setAccount(accounts[0]);
  }, [setAccount]);

  const connectOrDisconnectWallet = async () => {
    if(window.ethereum) {
      setIsMetaMaskInstalled(true);
      if(!account) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          handleAccountsChanged(accounts);
        } catch (error) {
          console.log("User rejected request");
        }
      } else {
        setAccount(null); // Disconnect the wallet
      }
    } else {
      setIsMetaMaskInstalled(false);
    }
  };

  useEffect(() => {
    if(window.ethereum) {
      setIsMetaMaskInstalled(true);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup function to avoid memory leaks and issues with multiple listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    } else {
      setIsMetaMaskInstalled(false);
    }
  }, [handleAccountsChanged]);

  return (
    <BlockchainContext.Provider value={{ account, isMetaMaskInstalled, connectOrDisconnectWallet }}>
      {children}
    </BlockchainContext.Provider>
  )
};
