import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { 
    expiresIn: '30d'
  });
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account blocked. Contact admin.' },
        { status: 403 }
      );
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = new Date(user.lastActiveDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastActive === yesterday) {
      user.streak += 1;
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
    } else if (lastActive !== today) {
      user.streak = 1;
    }
    
    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        badges: user.badges,
        college: user.college,
        branch: user.branch,
        completedQuestions: user.completedQuestions || []
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
