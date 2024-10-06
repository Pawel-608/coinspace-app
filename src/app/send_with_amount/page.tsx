'use client';

import React, {useState, useEffect} from "react";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import Link from 'next/link';

const getWalletAddress = async (userId: any) => {
    try {
        const response = await fetch(`/api/users/wallet/${userId}`, {cache: 'no-store'});
        if (!response.ok) {
            throw new Error('Failed to fetch wallet address');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        return null;
    }
}

function Finished({to, amount, signature}: any) {
    return (
        <div className="text-center mx-auto my-auto flex items-center justify-center h-screen">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Transaction Sent</h1>
                <p className="text-lg text-gray-700">To: <span className="font-semibold">{to}</span></p>
                <p className="text-lg text-gray-700">Amount: <span className="font-semibold">{amount} SOL</span></p>
                <Link href="/?no_redirect">
                    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-4">
                        Go back to Wallet
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function SendWithAmount() {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [userWallet, setUserWallet] = useState<any>(null);
    const [wallet, setWallet] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const lp = useLaunchParams();
    const userId = lp.initData?.user?.id;

    React.useEffect(() => {
        const findWalletId = async (userId: number | undefined) => {
            try {
                const response = await fetch('/api/wallet/' + userId);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWallet(data.address);
                console.log(data);
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        if (userId) {
            findWalletId(userId);
        }
    }, [userId]);

    React.useEffect(() => {
        const fetchBalance = async () => {
            if (!wallet) {
                return;
            }
            try {
                const response = await fetch('/api/balance?wallet=' + wallet, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBalance(data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setBalance(-1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [wallet]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const toParam = searchParams.get('to');
        const amountParam = searchParams.get('amount');

        if (toParam) setTo(toParam);
        if (amountParam) setAmount(amountParam);

        if (toParam) {
            getWalletAddress(toParam).then(address => {
                setUserWallet(address);
            });
        }
    }, []);

    const handleConfirm = async () => {
        try {
            const response = await fetch('/api/transactions/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: wallet,
                    to: userWallet?.address,
                    amount: parseFloat(amount),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send transaction');
            }

            const data = await response.json();
            console.log(data);
            setTxSignature(data.signature);
            setShowConfirmation(false);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setError("Failed to send transaction. Please try again.");
        }
    };

    const isInsufficientBalance = balance !== null && parseFloat(amount) > balance;

    useEffect(() => {
        if (isInsufficientBalance) {
            setError("Insufficient balance");
        } else {
            setError(null);
        }
    }, [isInsufficientBalance]);

    if (isLoading) {
        return <div className="w-screen pt-10 px-2 flex flex-col items-center gap-4">
            <p>Loading...</p>
        </div>;
    }


    return (
        txSignature ? <Finished signature={txSignature} to={userWallet.username} amount={amount}/> :
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6  flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Send SOL</h1>
                {userWallet && <p>To: {userWallet.username}</p>}
                {amount && <p>Amount: {amount} SOL</p>}
                {balance !== null && balance !== -1 && <p>Balance: {balance} SOL</p>}
                <div className="flex gap-4">
                    <button 
                        onClick={handleConfirm}
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${isInsufficientBalance ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isInsufficientBalance}
                    >
                        Confirm
                    </button>
                    <Link href="/?no_redirect">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Reject
                        </button>
                    </Link>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {txSignature && <p>Transaction sent: {txSignature}</p>}
            </div>
        </div>
    );
};