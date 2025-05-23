import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const endpoint = clusterApiUrl('devnet'); // or hardcoded string like above

 const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint as string}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
      
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
export default WalletContextProvider;