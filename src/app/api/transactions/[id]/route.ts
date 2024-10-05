import { NextRequest } from "next/server";
import { Connection, PublicKey } from '@solana/web3.js';
import {RPC_ENDPOINT, SERVER_BASE_URL} from "../../config";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/user/transactions/${params.id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user txs');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching txs:', error);
    return Response.json({ error: 'Failed to fetch txs' }, { status: 500 });
  }
}