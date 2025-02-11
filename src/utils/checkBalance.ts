// app/utils/checkBalance.ts
import { BrowserProvider, Contract, formatUnits } from 'ethers';

// GBR token ABI (minimum needed for balanceOf)
const GBR_ABI = [
    "function balanceOf(address) view returns (uint)"
];

const GBR_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GBR_CONTRACT_ADDRESS;
const GBR_DECIMALS = 9; // Adjust based on your token's decimals

export async function checkBalance(provider: any, address: string): Promise<number> {
    try {
        const ethersProvider = new BrowserProvider(provider);
        // Don't get signer since we're just reading
        const contract = new Contract(GBR_CONTRACT_ADDRESS!, GBR_ABI, ethersProvider);

        // Get balance
        const balance = await contract.balanceOf(address);
        
        // Convert to number considering decimals
        const formattedBalance = parseFloat(formatUnits(balance, GBR_DECIMALS));
        
        console.log(`Balance for ${address}: ${formattedBalance} GBR`);
        
        return formattedBalance;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw error;
    }
}