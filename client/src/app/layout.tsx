import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'NeoPAT AI Career Copilot',
  description: 'An all-in-one AI-powered career copilot platform for job discovery, resume optimization, application tracking, roadmap guidance, and mock interviews.',
  keywords: 'career copilot, job tracker, resume optimizer, ATS scanner, mock interviews, roadmaps',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", margin: 0 }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
