'use client';

import Link from 'next/link';
import { useWizard } from './wizard-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrustBadges } from '@/components/shared/trust-badges';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function ConfirmationStep() {
  const { state } = useWizard();

  return (
    <div className="animate-fade-in max-w-2xl mx-auto text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
        Your Order Has Been Submitted!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Thank you for choosing File and Go. Our team will begin reviewing your order shortly.
      </p>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What Happens Next?</h3>
          <ol className="text-left space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold shrink-0">1</span>
              <span><strong>Intake Review:</strong> Our team reviews your information and documents.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold shrink-0">2</span>
              <span><strong>Title Verification:</strong> We verify the property title and ownership details.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold shrink-0">3</span>
              <span><strong>Attorney Review:</strong> A licensed attorney reviews your deed for accuracy.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold shrink-0">4</span>
              <span><strong>Recording:</strong> We submit your deed for recording with the county.</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={state.orderId ? `/portal/orders/${state.orderId}` : '/portal'}>
          <Button className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold">
            View Order Status <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <Link href="/portal">
          <Button variant="outline">Go to Customer Portal</Button>
        </Link>
      </div>

      <div className="mt-12">
        <TrustBadges />
      </div>
    </div>
  );
}
