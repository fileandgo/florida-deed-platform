'use client';

import { useState } from 'react';
import { guidedQuestions, getRecommendation } from '@/config/scenarios';
import { getDocumentTypeBySlug, documentTypes } from '@/config/document-types';
import { useWizard } from './wizard-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GuidedFlow() {
  const { state, dispatch } = useWizard();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const currentQuestion = guidedQuestions[currentQuestionIndex];
  const selectedAnswer = state.guidedAnswers[currentQuestion?.id];

  const handleAnswer = (questionId: string, optionId: string) => {
    dispatch({ type: 'SET_GUIDED_ANSWER', questionId, answerId: optionId });

    const option = currentQuestion.options.find((o) => o.id === optionId);
    if (option?.nextQuestionId) {
      const nextIndex = guidedQuestions.findIndex((q) => q.id === option.nextQuestionId);
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
        return;
      }
    }
    // No next question - show recommendation
    setShowRecommendation(true);
  };

  const handleBack = () => {
    if (showRecommendation) {
      setShowRecommendation(false);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go back to scenario selector
      dispatch({ type: 'SET_SCENARIO', scenario: '' });
      dispatch({ type: 'SET_STEP', step: 0 });
    }
  };

  if (showRecommendation) {
    const recommendation = getRecommendation(state.scenario || '', state.guidedAnswers);
    const docType = getDocumentTypeBySlug(recommendation.documentTypeSlug);

    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10 mx-auto mb-4">
            <Check className="h-8 w-8 text-brand-teal" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy">Our Recommendation</h2>
        </div>

        <Card className="mb-6 border-brand-teal">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{docType?.name || 'Deed Preparation'}</h3>
            <p className="text-muted-foreground mb-3">{docType?.description}</p>
            <p className="text-sm text-muted-foreground italic">{recommendation.reasoning}</p>
          </CardContent>
        </Card>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              This is a preliminary recommendation based on the information you provided, not a legal determination.
              Our team will review and confirm the best document type for your situation.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: 'SET_DOCUMENT_TYPE', documentTypeId: recommendation.documentTypeSlug });
              dispatch({ type: 'SET_STEP', step: 2 });
            }}
            className="flex-1 bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold"
          >
            Continue with {docType?.name} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <button
          className="text-sm text-muted-foreground underline mt-4 block mx-auto hover:text-foreground"
          onClick={() => {
            dispatch({ type: 'SET_STEP', step: 1 });
          }}
        >
          I'd prefer to choose a different document type
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-sm text-brand-teal font-medium mb-2">
          Question {currentQuestionIndex + 1} of {guidedQuestions.length}
        </p>
        <h2 className="text-2xl font-bold text-brand-navy">{currentQuestion.question}</h2>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <Card
            key={option.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md hover:border-brand-teal/50',
              selectedAnswer === option.id && 'ring-2 ring-brand-teal border-brand-teal'
            )}
            onClick={() => handleAnswer(currentQuestion.id, option.id)}
          >
            <CardContent className="p-4">
              <h4 className="font-medium">{option.label}</h4>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
}
