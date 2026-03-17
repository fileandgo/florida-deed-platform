'use client';

import { useWizard } from './wizard-context';
import { evaluateScreening } from '@/config/screening-rules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScreeningStep() {
  const { state, dispatch } = useWizard();
  const [result, setResult] = useState<ReturnType<typeof evaluateScreening> | null>(null);

  useEffect(() => {
    const hasEntity = state.parties.some((p) => p.entityType === 'ENTITY');
    const hasTrust = state.parties.some((p) => p.entityType === 'TRUST');

    const screeningInput = {
      transferType: state.transfer?.reason || '',
      recipientType: state.parties.find((p) => p.role === 'GRANTEE')?.entityType || 'INDIVIDUAL',
      estimatedValue: state.transfer?.estimatedValue || null,
      hasFinancing: state.transfer?.hasFinancing ?? null,
      propertyType: state.property?.propertyType || '',
      grantorCount: state.parties.filter((p) => p.role === 'GRANTOR').length,
      granteeCount: state.parties.filter((p) => p.role === 'GRANTEE').length,
      hasEntityInvolved: hasEntity,
      hasTrustInvolved: hasTrust,
      county: state.property?.county || '',
    };

    const evaluation = evaluateScreening(screeningInput);
    setResult(evaluation);

    dispatch({
      type: 'SET_SCREENING',
      data: {
        transferType: screeningInput.transferType,
        recipientType: screeningInput.recipientType,
        estimatedValue: screeningInput.estimatedValue,
        hasFinancing: screeningInput.hasFinancing,
        propertyType: screeningInput.propertyType,
        hasEntityInvolved: hasEntity,
        hasTrustInvolved: hasTrust,
      },
      result: evaluation.result,
    });
  }, []);

  const resultConfig = {
    standard: {
      badge: 'success' as const,
      label: 'Standard Processing',
      icon: ShieldCheck,
      message: 'Based on the information provided, your order qualifies for standard processing.',
    },
    enhanced_review: {
      badge: 'warning' as const,
      label: 'Enhanced Review',
      icon: Info,
      message: 'Based on the details you provided, this transaction may require additional review by our team. This is a routine part of our quality assurance process.',
    },
    fincen_review: {
      badge: 'warning' as const,
      label: 'Compliance Review Required',
      icon: AlertTriangle,
      message: 'This transaction may require compliance review based on current regulations. Our team will guide you through any additional requirements.',
    },
  };

  const config = result ? resultConfig[result.result] : null;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Transaction Screening</h2>
        <p className="text-muted-foreground mt-1">
          We perform a preliminary review to ensure your order is processed correctly.
        </p>
      </div>

      {config && result && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <config.icon className="h-5 w-5 text-brand-teal" />
              Screening Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={config.badge}>{config.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.message}</p>

            {result.result !== 'standard' && (
              <div className="mt-4 bg-muted/50 rounded-lg p-4">
                <p className="text-sm">
                  <strong>What this means:</strong> Your order will proceed normally. Our team may reach out
                  if additional information is needed during the review process. This does not affect
                  your ability to submit your order.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-3">Summary of Screening Factors</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Transfer Type</dt>
              <dd className="font-medium">{state.transfer?.reason || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated Value</dt>
              <dd className="font-medium">
                {state.transfer?.estimatedValue
                  ? `$${state.transfer.estimatedValue.toLocaleString()}`
                  : 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Financing Involved</dt>
              <dd className="font-medium">
                {state.transfer?.hasFinancing === true ? 'Yes' : state.transfer?.hasFinancing === false ? 'No' : 'Not specified'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Parties</dt>
              <dd className="font-medium">{state.parties.length} total</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Entity/Trust Involved</dt>
              <dd className="font-medium">
                {state.parties.some((p) => p.entityType !== 'INDIVIDUAL') ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 5 })}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={() => dispatch({ type: 'SET_STEP', step: 7 })}
          className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
