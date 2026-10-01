import React from 'react';

export const metadata = {
  title: 'Cvyon Admin',
  robots: 'noindex, nofollow'
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-navy font-sans selection:bg-lavender selection:text-navy">
      {children}
    </div>
  );
}
