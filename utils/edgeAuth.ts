import { jwtVerify } from 'jose';

export async function verifyTokenEdge(token: string): Promise<unknown> {
  if (!token) return null;
  
  try {
    // Create a TextEncoder
    const encoder = new TextEncoder();
    
    // Convert JWT_SECRET to Uint8Array
    const secretKey = encoder.encode(process.env.JWT_SECRET);
    
    // Verify the token
    const { payload } = await jwtVerify(token, secretKey);
    
    return payload;
  } catch (error) {
    console.error('Edge token verification failed:', error);
    return null;
  }
}