'use client'

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAppKit, useAppKitAccount, useWalletInfo, useAppKitProvider } from "@reown/appkit/react";
import { checkBalance } from "@/utils/checkBalance";

interface AuthContextType {
  w3mButton: any;
  walletInfo: any;
  address: string | undefined;
  isConnected: boolean;
  walletProvider: any;
  checkUserAccess: () => Promise<{ exists: boolean, balance: number | null }>;
  handleWikiRedirect: (address: string, balance: number) => Promise<void>;
  isLoading: boolean;
  isWikiLoading: boolean;
  isCheckingAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const w3mButton = useAppKit();
  const { walletInfo } = useWalletInfo();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isWikiLoading, setIsWikiLoading] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  const checkUserAccess = async () => {
    if (!isConnected || !walletProvider || !address) {
      return { exists: false, balance: null };
    }

    setIsCheckingAccess(true);
    try {
      const balance = await checkBalance(walletProvider, address);
      
      const checkResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      const { exists } = await checkResponse.json();
      return { exists, balance };
    } catch (error) {
      console.error('Error checking access:', error);
      return { exists: false, balance: null };
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const handleWikiRedirect = async (address: string, balance: number) => {
    setIsWikiLoading(true);
    try {
      const tokenResponse = await fetch('/api/auth/wiki-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, balance })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get token');
      }

      const { token } = await tokenResponse.json();
      window.location.href = `${process.env.NEXT_PUBLIC_WIKI_URL}/login/gyber/callback?jwt=${token}`;
    } catch (error) {
      console.error('Error redirecting to wiki:', error);
      throw error;
    } finally {
      setIsWikiLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      w3mButton,
      walletInfo,
      address,
      isConnected,
      walletProvider,
      checkUserAccess,
      handleWikiRedirect,
      isLoading,
      isWikiLoading,
      isCheckingAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}