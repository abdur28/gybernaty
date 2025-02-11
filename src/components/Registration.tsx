import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppKitAccount } from '@reown/appkit/react';
import { getAccessLevel } from '../utils/checkAccess';

export default function Registration() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check token balance first
      const accessLevel = await getAccessLevel(address);
      
      if (accessLevel === 'unauthorized') {
        setError('Insufficient GBR balance. Minimum 1B GBR required.');
        return;
      }

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, username })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      // Redirect to profile completion
      router.push('/profile/complete');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
        <p>Please connect your wallet to continue registration</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}