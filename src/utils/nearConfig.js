import { connect, keyStores, WalletConnection } from 'near-api-js';

const nearConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

// Initialize contract & set global variables
export async function initNear() {
  // Initialize connection to the NEAR testnet
  const near = await connect({
    ...nearConfig,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const wallet = new WalletConnection(near, 'startup-dashboard');

  return { near, wallet };
}

export { nearConfig };
