import { NextRequest } from "next/server";
import { Connection, PublicKey } from '@solana/web3.js';
import { RPC_ENDPOINT } from "../config";

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

const getBalance = async (publicKey: string) => {
  try {
    const balance = await connection.getBalance(new PublicKey(publicKey));
   
    return (balance / Math.pow(10, 9));
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
};

export async function GET(request: NextRequest) {
    const wallet_addr = request.nextUrl.searchParams.get("wallet") as string

    if(!wallet_addr) {
      return new Response(JSON.stringify({ error: 'No wallet' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const balance = await getBalance(wallet_addr);

    if (balance !== null) {
      return new Response(JSON.stringify({ balance }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to get balance' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
  }