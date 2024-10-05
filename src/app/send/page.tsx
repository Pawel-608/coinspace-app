'use client';

import React, {useState, useEffect} from "react";
import Link from 'next/link';
import Image from 'next/image';

const findUsers = async (name: string) => {
    try {
        const response = await fetch(`/api/users?name=${name}`, {cache: 'no-store'});
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json()
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error finding users:', error);
        return [];
    }
}


const getWalletAddress = async (userId: number) => {
    try {
        const response = await fetch(`/api/users/wallet/${userId}`, {cache: 'no-store'});
        if (!response.ok) {
            throw new Error('Failed to fetch wallet address');
        }
        const data = await response.json();
        return data.address;
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        return null;
    }
}

const shortenAddress = (address: string | null, startLength: number = 4, endLength: number = 4): string => {
    if (!address) return '';
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export default function SendPage() {
    const [userList, setUserList] = useState<any[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedUserWallet, setSelectedUserWallet] = useState<string | null>(null);
    const [balance, setBalance] = React.useState(0);
    const [amount, setAmount] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [copiedSignature, setCopiedSignature] = useState<boolean>(false);

    const [wallet, setWalletAddress] = useState(null)
    const userId = 6946963704

    React.useEffect(() => {
        const findWalletId = async (userId: number) => {
            try {
                const response = await fetch('/api/wallet/' + userId);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWalletAddress(data.address)
                console.log(data)
            } catch (error) {
                console.error('Error fetching balance:', error);
                return ""
            }
        };

        findWalletId(userId);
    }, []);

    React.useEffect(() => {
        const fetchBalance = async () => {
            if(!wallet) {
                return
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
            }
        };

        fetchBalance();
    }, [wallet]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (userName.length > 0) {
                const users = await findUsers(userName);
                setUserList(users);
            } else {
                setUserList([]);
            }
        };

        const debounceTimer = setTimeout(fetchUsers, 100);

        return () => clearTimeout(debounceTimer);
    }, [userName]);

    useEffect(() => {
        if (selectedUser) {
            const fetchWalletAddress = async () => {
                const address = await getWalletAddress(selectedUser.id);
                setSelectedUserWallet(address);
            };
            fetchWalletAddress();
        }
    }, [selectedUser]);

    const handleSendClick = () => {
        if (!amount || parseFloat(amount) === 0 || !selectedUser) {
            setError("Please enter a valid amount and select a recipient.");
            return;
        }
        setError(null);
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch('/api/transactions/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: wallet,
                    to: selectedUserWallet,
                    amount: parseFloat(amount),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send transaction');
            }

            const data = await response.json();
            console.log(data)
            setTxSignature(data.signature);
            setShowConfirmation(false);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setError("Failed to send transaction. Please try again.");
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedSignature(true);
            setTimeout(() => setCopiedSignature(false), 2000);
        });
    };

    return (
        <div className="w-full pt-10 flex flex-col justify-center items-center gap-6">
            <h1 className="text-2xl font-semibold text-center">Send SOL</h1>
            <div className="flex flex-col gap-4 w-96 px-8">
                <div className="flex flex-col gap-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount (SOL)</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        max={balance > 0.01 ? balance - 0.01 : 0}
                        min={0}
                        step="0.0001"
                        value={amount}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value > balance - 0.01) {
                                setAmount((balance > 0.01 ? balance - 0.01 : 0).toFixed(4));
                            } else {
                                setAmount(e.target.value);
                            }
                        }}
                    />
                    <p className="text-sm text-gray-500">Max amount: {(balance > 0.01 ? balance - 0.01 : 0).toFixed(4)} SOL</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="recipient" className="text-sm font-medium">Recipient</label>
                    <input
                        type="text"
                        id="recipient"
                        placeholder="Enter recipient name"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                        value={userName}
                    />
                    {userList.length > 0 && (
                        <ul className="mt-2 border border-gray-300 rounded-md">
                            {userList.map((user, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setUserName(user.username)
                                        setUserList([]);
                                    }}
                                >
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {txSignature && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Transaction sent!</strong>
                        <br />
                        <p className="block sm:inline">Signature:  
                            <span className="font-mono ml-1">{shortenAddress(txSignature)}</span>
                            <button 
                                onClick={() => copyToClipboard(txSignature)}
                                className="ml-2 focus:outline-none"
                                title="Copy to clipboard"
                            >
                                <Image
                                    src="/copy.svg"
                                    alt="Copy"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </p>
                        {copiedSignature && <span className="text-sm">Copied!</span>}
                    </div>
                )}
                <div className="flex justify-between mt-4">
                    <Link href="/">
                        <button
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors"
                        onClick={handleSendClick}
                    >
                        Send
                    </button>
                </div>
            </div>
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Confirm Transaction</h2>
                        <p>Are you sure you want to
                            send <b>{parseFloat(amount).toFixed(4)} SOL</b> to <b>{userName}</b> ({shortenAddress(selectedUserWallet)})?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white rounded-md"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};