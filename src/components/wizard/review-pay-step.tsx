'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWizard } from './wizard-context';
import { getDocumentTypeBySlug } from '@/config/document-types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrustBadges } from '@/components/shared/trust-badges';
import {
  ArrowLeft, CreditCard, Shield, Scale, FileCheck, Clock,
  User, MapPin, ArrowLeftRight, Users, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export function ReviewPayStep() {
  const { state, dispatch } = useWizard();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const docType = state.documentTypeId ? getDocumentTypeBySlug(state.documentTypeId) : null;
  const serviceFee = docType?.baseFee || 399;
  const recordingFee = docType?.estimatedRecordingFee || 35;
  const total = serviceFee + recordingFee;

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Please sign in to continue with payment.');
      router.push(`/login?callbackUrl=/wizard?step=review`);
      return;
    }

    setLoading(true);
    try {
      // Create order first
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioType: state.scenario,
          documentTypeSlug: state.documentTypeId,
          contact: state.contact,
          property: state.property,
          transfer: state.transfer,
          parties: state.parties,
          screeningResult: state.screeningResult,
          screeningData: state.screeningData,
          uploadedDocuments: state.uploadedDocuments,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const order = await orderRes.json();
      dispatch({ type: 'SET_ORDER_ID', orderId: order.id });

      // Create Stripe checkout session
      const checkoutRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!checkoutRes.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await checkoutRes.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Review Your Order</h2>
        <p className="text-muted-foreground mt-1">Please review all details before proceeding to payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Document type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-brand-teal" /> Document Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{docType?.name || 'To be determined during review'}</p>
              {state.screeningResult && state.screeningResult !== 'standard' && (
                <Badge variant="warning" className="mt-2">Enhanced Review Required</Badge>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-brand-teal" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{state.contact?.firstName} {state.contact?.lastName}</p>
              <p className="text-muted-foreground">{state.contact?.email}</p>
              <p className="text-muted-foreground">{state.contact?.phone}</p>
            </CardContent>
          </Card>

          {/* Property */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-teal" /> Property
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{state.property?.address}</p>
              <p>{state.property?.city}, {state.property?.state} {state.property?.zip}</p>
              <p className="text-muted-foreground">{state.property?.county} County</p>
            </CardContent>
          </Card>

          {/* Parties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-teal" /> Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Grantor(s)</p>
                  {state.parties.filter((p) => p.role === 'GRANTOR').map((p, i) => (
                    <p key={i} className="text-muted-foreground">{p.name}</p>
                  ))}
                </div>
                <div>
                  <p className="font-medium mb-1">Grantee(s)</p>
                  {state.parties.filter((p) => p.role === 'GRANTEE').map((p, i) => (
                    <p key={i} className="text-muted-foreground">{p.name}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment summary */}
        <div className="space-y-4">
          <Card className="border-brand-teal">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="font-medium">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Recording Fee</span>
                  <span className="font-medium">{formatCurrency(recordingFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-brand-teal">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold h-12 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-brand-navy/30 border-t-brand-navy rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Proceed to Payment
                  </span>
                )}
              </Button>

              {!session && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll need to sign in or create an account before payment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trust elements */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-brand-teal shrink-0" />
                <span>Attorney reviewed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-brand-teal shrink-0" />
                <span>Title verification included</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileCheck className="h-4 w-4 text-brand-teal shrink-0" />
                <span>Recording support included</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-brand-teal shrink-0" />
                <span>3-5 business day turnaround</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 7 })}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
}
