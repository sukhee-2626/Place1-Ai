import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';
import { NextRequest } from 'next/server';

export async function protect(req: NextRequest) {
  try {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token) {
      return { user: null, error: 'Not authorized, no token', status: 401 };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return { user: null, error: 'User not found', status: 401 };
    }
    
    return { user, error: null, status: 200 };
  } catch (error) {
    return { user: null, error: 'Token invalid or expired', status: 401 };
  }
}

export async function adminOnly(req: NextRequest) {
  const auth = await protect(req);
  if (auth.error || !auth.user) {
    return auth;
  }
  
  if (auth.user.role === 'admin') {
    return { user: auth.user, error: null, status: 200 };
  } else {
    return { user: null, error: 'Admin access required', status: 403 };
  }
}
