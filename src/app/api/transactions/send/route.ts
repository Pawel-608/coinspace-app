import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { from, to, amount } = await request.json();

    const response = await fetch('http://localhost:8080/api/tx/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, amount }),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to send transaction');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error sending transaction:', error);
    return Response.json({ error: 'Failed to send transaction' }, { status: 500 });
  }
}