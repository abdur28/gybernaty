// app/register/page.tsx
'use client'

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { 
        address, 
        isConnected, 
        checkUserAccess, 
        handleWikiRedirect,
        isCheckingAccess,
        isWikiLoading 
    } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { balance } = await checkUserAccess();
            if (balance === null) {
                throw new Error('Could not check balance');
            }

            // Register user
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, username, balance })
            });

            if (!registerResponse.ok) {
                const data = await registerResponse.json();
                throw new Error(data.message);
            }

            await handleWikiRedirect(address!, balance);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    minLength={3}
                                    maxLength={30}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {error}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isCheckingAccess || isWikiLoading}
                                className="..."
                            >
                                {isCheckingAccess ? 'Checking Access...' :
                                isWikiLoading ? 'Redirecting to Wiki...' : 
                                'Create account'}
                            </button>
                        </div>

                        <div className="text-sm text-center text-gray-600">
                            Your wallet address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}