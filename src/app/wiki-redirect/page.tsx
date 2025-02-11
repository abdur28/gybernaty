// src/app/wiki-redirect/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';

export default function WikiRedirect() {
    const router = useRouter();
    const { address, isConnected } = useAppKitAccount();

    useEffect(() => {
        const redirectToWiki = async () => {
            if (!isConnected || !address) {
                router.push('/');
                return;
            }

            try {
                // Get Wiki.js JWT token
                const response = await fetch('/api/auth/wiki-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address })
                });

                if (!response.ok) {
                    throw new Error('Failed to get Wiki token');
                }

                const { token } = await response.json();

                // Redirect to Wiki.js with JWT token
                window.location.href = `${process.env.NEXT_PUBLIC_WIKI_URL}/login?jwt=${token}`;
            } catch (error) {
                console.error('Redirect error:', error);
                router.push('/error');
            }
        };

        redirectToWiki();
    }, [address, isConnected, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Redirecting to Documentation...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}