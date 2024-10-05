import { NextRequest } from "next/server";
import { SERVER_BASE_URL } from "../../../config";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/user/address/${params.id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user wallet address');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching wallet address:', error);
    return Response.json({ error: 'Failed to fetch wallet address' }, { status: 500 });
  }
}