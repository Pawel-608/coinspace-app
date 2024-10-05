import Image from 'next/image'


import React from 'react';

interface Transaction {
    type: 'send' | 'receive';
    amount: number;
    address: string;
    date: string;
}

const Transaction: React.FC<Transaction> = ({type, amount, address, date}) => {
    const imgSize = 24;
    const imgSrc = type === 'send' ? "/send.svg" : "/recieve.svg";
    const altText = type === 'send' ? "Send" : "Receive";
    const amountColor = type === 'send' ? 'text-red-500' : 'text-green-500';

    return (
        <div className="flex flex-row items-center justify-between py-2 border-b border-gray-200 w-full max-w-[20rem]">
            <div className="flex flex-row items-center gap-3">
                <Image
                    src={imgSrc}
                    alt={altText}
                    width={imgSize}
                    height={imgSize}
                />
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{type === 'send' ? 'Sent to' : 'Received from'}</p>
                    <p className="text-xs text-gray-500">{address}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className={`text-sm font-medium ${amountColor}`}>{type === 'send' ? '-' : '+'}{amount.toFixed(4)} SOL</p>
                <p className="text-xs text-gray-500">{date}</p>
            </div>
        </div>
    );
};

const Transactions = ({wallet, userId}: { wallet: string, userId: number }) => {
    const [txs, setTxs] = React.useState([]);


    React.useEffect(() => {
        const fetchTxs = async () => {
            try {
                const response = await fetch('/api/transactions/' + userId, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTxs(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchTxs();
    }, [userId]);

    return (
        <div className='flex flex-col items-center gap-5 w-full'>
            <Transaction type='send' amount={1.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
            <Transaction type='receive' amount={0.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
            <Transaction type='receive' amount={1.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
            <Transaction type='send' amount={0.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
            <Transaction type='send' amount={0.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
            <Transaction type='send' amount={0.023} address="@iDatsY" date="2024-03-15 15:21:11"/>
        </div>
    )
}

export default Transactions