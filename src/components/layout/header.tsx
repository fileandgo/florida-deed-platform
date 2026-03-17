'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FileText, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-brand-teal">
              <FileText className="h-4 w-4 text-brand-teal" />
            </div>
            <span className="text-lg font-bold">File and Go</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-brand-teal transition-colors">
              Home
            </Link>
            <Link href="/wizard" className="text-sm hover:text-brand-teal transition-colors">
              Get Started
            </Link>
            {session ? (
              <>
                <Link href="/portal" className="text-sm hover:text-brand-teal transition-colors">
                  My Orders
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">{session.user?.name || session.user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-brand-teal hover:bg-transparent"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:text-brand-teal hover:bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 text-sm hover:text-brand-teal" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/wizard" className="block py-2 text-sm hover:text-brand-teal" onClick={() => setMobileOpen(false)}>Get Started</Link>
            {session ? (
              <>
                <Link href="/portal" className="block py-2 text-sm hover:text-brand-teal" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <button className="block py-2 text-sm text-red-300 hover:text-red-200" onClick={() => signOut()}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-sm hover:text-brand-teal" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/register" className="block py-2 text-sm hover:text-brand-teal" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
