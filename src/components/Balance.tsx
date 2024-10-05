import React from 'react';

const formatBalance = (number: number): string => {
    return number.toFixed(4);
};

const Balance = ({wallet}: { wallet: string }) => {
    const [balance, setBalance] = React.useState(0);

    React.useEffect(() => {
        const fetchBalance = async () => {
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

    const formattedBalance = formatBalance(balance)

    return (
        <div className='flex flex-col gap-6 items-center'>
            <p className='text-xl'>Total balance:</p>
            <p>
                <span className='text-6xl font-semibold'>{formattedBalance.split(".")[0]}</span>
                <span className='text-3xl font-semibold'>.{formattedBalance.split(".")[1]}</span>
                <span className='font-medium'> SOL</span>
            </p>
        </div>
    );
};

export default Balance