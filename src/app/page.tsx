'use client';

import Actions from "@/components/Actions";
import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";
import React, {useState} from "react";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import {parseInitialData} from "@/utils/utils";
import { useRouter } from 'next/navigation';



export default function LaunchParamsPage() {
    const lp = useLaunchParams();
    const [walletAddress, setWalletAddress] = useState(null)
    const userId = lp.initData?.user?.id
    const startData = parseInitialData(lp.initData?.startParam)
    const router = useRouter();

    React.useEffect(() => {
        const doRedirect = window.location.search.includes("tgWebAppStartParam");
        
        if (doRedirect && startData.exists) {
            if(startData.type == "with_amount") {
                router.push(`/send_with_amount?to=${startData.to}&amount=${startData.amount}&${window.location.search}`)
            }else{
                router.push(`/send_with_amount?to=${startData.to}`);
            }
        }
      }, [startData, router]);
    
    React.useEffect(() => {
        const findWalletId = async (userId: any) => {
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
    }, [userId]);

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