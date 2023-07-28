// components/Header.js

'use client';

import { useContext } from 'react'
import Link from 'next/link'
import { BlockchainContext } from '../components/BlockchainContext'

export default function Header() {
  const { account, isMetaMaskInstalled, connectOrDisconnectWallet } = useContext(BlockchainContext);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6 fixed w-full z-10 top-0">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link legacyBehavior href="/" passHref={true}>
          <a className="font-semibold text-xl tracking-tight">Shelf</a>
        </Link>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link legacyBehavior href="/deploy" passHref={true}>
            <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Deploy
            </a>
          </Link>
        </div>
        <div className="text-sm lg:flex-grow">
          <Link legacyBehavior href="/mint" passHref={true}>
            <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Mint
            </a>
          </Link>
        </div>
        <div className="text-sm lg:flex-grow">
          <Link legacyBehavior href="/deployShelf" passHref={true}>
            <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Deploy Shelf
            </a>
          </Link>
        </div>
        <div className="text-sm lg:flex-grow">
          <Link legacyBehavior href="/deployInterestRateModel" passHref={true}>
            <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Deploy Interest Rate Model
            </a>
          </Link>
        </div>
        <div>
          {isMetaMaskInstalled ? (
            <button onClick={connectOrDisconnectWallet} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
              {account ? `Disconnect: ${account}` : "Connect to MetaMask"}
            </button>
          ) : (
            <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Install MetaMask</a>
          )}
        </div>
      </div>
    </nav>
  )
}
