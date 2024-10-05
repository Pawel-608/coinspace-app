import { NextRequest } from "next/server";
import { Connection, PublicKey } from '@solana/web3.js';
import {RPC_ENDPOINT, SERVER_BASE_URL} from "../../config";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/user/address/${params.id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user address');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching user address:', error);
    return Response.json({ error: 'Failed to fetch user address' }, { status: 500 });
  }
  }