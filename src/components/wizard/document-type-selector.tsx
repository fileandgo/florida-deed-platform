'use client';

import { documentTypes } from '@/config/document-types';
import { useWizard } from './wizard-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export function DocumentTypeSelector() {
  const { state, dispatch } = useWizard();

  const handleSelect = (slug: string) => {
    dispatch({ type: 'SET_DOCUMENT_TYPE', documentTypeId: slug });
  };

  const handleContinue = () => {
    if (state.documentTypeId) {
      dispatch({ type: 'SET_STEP', step: 2 });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Select Document Type</h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Choose the type of deed you need. If you're unsure, our team will help confirm the right option during review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {documentTypes.map((dt) => (
          <Card
            key={dt.slug}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md hover:border-brand-teal/50',
              state.documentTypeId === dt.slug && 'ring-2 ring-brand-teal border-brand-teal'
            )}
            onClick={() => handleSelect(dt.slug)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 shrink-0">
                  <FileText className="h-5 w-5 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{dt.name}</h3>
                    <span className="text-sm font-semibold text-brand-teal">
                      {formatCurrency(dt.baseFee)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{dt.description}</p>
                  <p className="text-xs text-brand-blue/70 mt-2 italic">{dt.useCaseHint}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-8 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 0 })}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!state.documentTypeId}
          className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
