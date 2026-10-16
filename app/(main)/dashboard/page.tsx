import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard — Cvyon',
  description: 'Manage your resumes on Cvyon.',
  robots: 'noindex, nofollow',
  alternates: { canonical: 'https://cvyon.com/dashboard' },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
