'use client';

import React from "react";
import QRCode from "react-qr-code";

import {useLaunchParams} from "@telegram-apps/sdk-react";
import Link from "next/link";


export default function SendPage() {
    const lp = useLaunchParams();
    const userId = lp.initData?.user?.id

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
            <h1 className="">Scan code</h1>
            <QRCode value={`https://localhost:3000/send?to=${userId}`} />
            <Link href="/" className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                Go back to Main Page
            </Link>
        </div>
    );
};