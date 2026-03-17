import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrustBadges } from '@/components/shared/trust-badges';
import {
  ArrowRight, FileText, Shield, Scale, Clock,
  UserPlus, Heart, FileEdit, HelpCircle,
} from 'lucide-react';

const quickScenarios = [
  { icon: UserPlus, label: 'Add someone to title', href: '/wizard?scenario=add-person' },
  { icon: Shield, label: 'Transfer to a trust', href: '/wizard?scenario=transfer-trust' },
  { icon: Heart, label: 'Transfer to family', href: '/wizard?scenario=transfer-family' },
  { icon: FileEdit, label: 'Correct a deed', href: '/wizard?scenario=correct-deed' },
  { icon: HelpCircle, label: "Not sure? We'll help", href: '/wizard?scenario=not-sure' },
  { icon: FileText, label: 'I know what I need', href: '/wizard?scenario=know-what-i-need' },
];

const howItWorks = [
  {
    step: '1',
    title: 'Tell Us About Your Situation',
    description: 'Answer a few simple questions or select your document type directly.',
  },
  {
    step: '2',
    title: 'Provide Your Details',
    description: 'Enter property and party information through our guided wizard.',
  },
  {
    step: '3',
    title: 'We Prepare Your Deed',
    description: 'Our team prepares, reviews, and verifies your deed with attorney oversight.',
  },
  {
    step: '4',
    title: 'Recorded & Delivered',
    description: 'We submit for recording and deliver your completed, recorded deed.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Professional Deed Preparation,{' '}
              <span className="text-brand-teal">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Attorney-reviewed deed preparation with title verification and recording support.
              We handle the complexity so you don't have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/wizard">
                <Button
                  size="lg"
                  className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold text-base w-full sm:w-auto"
                >
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/wizard?scenario=know-what-i-need">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  I Know What I Need
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario quick-links */}
      <section className="py-16 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-navy mb-2">
            What Do You Need Help With?
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Select your situation and we'll guide you to the right solution.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {quickScenarios.map((s) => (
              <Link key={s.label} href={s.href}>
                <Card className="h-full hover:shadow-md hover:border-brand-teal/50 transition-all cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 mb-3">
                      <s.icon className="h-6 w-6 text-brand-teal" />
                    </div>
                    <span className="text-sm font-medium">{s.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-navy mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 bg-brand-light-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-navy mb-8">
            Why Choose File and Go
          </h2>
          <TrustBadges />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Start your deed preparation in minutes. Our guided process makes it easy.
          </p>
          <Link href="/wizard">
            <Button
              size="lg"
              className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold text-base"
            >
              Begin Your Order <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
