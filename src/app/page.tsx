'use client';

import Actions from "@/components/Actions";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import React, {useState} from "react";


export default function LaunchParamsPage() {
    // const lp = useLaunchParams();
    // const lp = {}
    const [walletAddress, setWalletAddress] = useState(null)
    const userId = 6946963704

    React.useEffect(() => {
        const findWalletId = async (userId) => {
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

    return (
            <div className="w-screen pt-10 px-2 flex flex-col gap-10">
                {
                    walletAddress == null ? <></> : (<>
                            <Balance wallet={walletAddress}/>
                            <Actions wallet={walletAddress}/>
                            <Transactions wallet={walletAddress} userId={userId}/>
                        </>
                    )
                }
            </div>
    );
};