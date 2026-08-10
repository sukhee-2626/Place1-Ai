import { NextRequest, NextResponse } from 'next/server';
import { protect } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await protect(req);
    
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }
    
    return NextResponse.json({ success: true, user: auth.user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
