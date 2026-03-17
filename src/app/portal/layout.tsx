import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Portal - File and Go',
  description: 'View and manage your deed preparation orders.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-light-gray min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
