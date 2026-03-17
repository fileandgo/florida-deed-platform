'use client';

import { scenarios } from '@/config/scenarios';
import { useWizard } from './wizard-context';
import { Card, CardContent } from '@/components/ui/card';
import {
  UserPlus, Shield, Heart, UserMinus, FileEdit, HelpCircle, FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  UserPlus, Shield, Heart, UserMinus, FileEdit, HelpCircle, FileCheck,
};

export function ScenarioSelector() {
  const { state, dispatch } = useWizard();

  const handleSelect = (scenarioId: string) => {
    dispatch({ type: 'SET_SCENARIO', scenario: scenarioId });

    if (scenarioId === 'know-what-i-need') {
      // Go to document type selection step
      dispatch({ type: 'SET_STEP', step: 1 });
    } else if (scenarioId === 'not-sure') {
      // Go to guided flow
      dispatch({ type: 'SET_STEP', step: 0.5 as any }); // Guided sub-step handled in container
    } else {
      // Go to details step with scenario context
      dispatch({ type: 'SET_STEP', step: 2 });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
          How can we help you today?
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Select the option that best describes your situation. Not sure? We'll guide you through it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {scenarios.map((scenario) => {
          const Icon = iconMap[scenario.icon] || FileCheck;
          const isSelected = state.scenario === scenario.id;

          return (
            <Card
              key={scenario.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:border-brand-teal/50',
                isSelected && 'ring-2 ring-brand-teal border-brand-teal'
              )}
              onClick={() => handleSelect(scenario.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full mb-4 transition-colors',
                      isSelected ? 'bg-brand-teal text-white' : 'bg-brand-teal/10 text-brand-teal'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{scenario.title}</h3>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
