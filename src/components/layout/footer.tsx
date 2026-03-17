import { FileText } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-brand-teal">
                <FileText className="h-4 w-4 text-brand-teal" />
              </div>
              <span className="text-lg font-bold text-white">File and Go</span>
            </div>
            <p className="text-sm">
              Professional deed preparation services. Attorney-reviewed, title-verified, and recorded with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wizard" className="hover:text-brand-teal transition-colors">Deed Preparation</Link></li>
              <li><Link href="/wizard" className="hover:text-brand-teal transition-colors">Property Transfers</Link></li>
              <li><Link href="/wizard" className="hover:text-brand-teal transition-colors">Title Corrections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portal" className="hover:text-brand-teal transition-colors">Customer Portal</Link></li>
              <li><span className="text-gray-400">support@fileandgo.com</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} File and Go. All rights reserved.
          <span className="mx-2">|</span>
          This is a deed preparation service, not a law firm. We do not provide legal advice.
        </div>
      </div>
    </footer>
  );
}
