import { NextRequest } from "next/server";
import { SERVER_BASE_URL } from "../config";

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) {
      return Response.json({ error: 'Name parameter is required' }, { status: 400 });
    }

    const response = await fetch(`${SERVER_BASE_URL}/api/user/find?name=${(name)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}