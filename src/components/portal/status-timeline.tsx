'use client';

import { statusSteps } from '@/types';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOrder = ['SUBMITTED', 'PAID', 'INTAKE_REVIEW', 'IN_PROGRESS', 'COMPLETED'];

export function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="space-y-0">
      {statusSteps.map((step, index) => {
        const isCompleted = index < effectiveIndex;
        const isCurrent = index === effectiveIndex;
        const isFuture = index > effectiveIndex;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Line + circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                  isCompleted
                    ? 'bg-brand-teal text-white'
                    : isCurrent
                    ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              {index < statusSteps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-10',
                    isCompleted ? 'bg-brand-teal' : 'bg-muted'
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-8">
              <p
                className={cn(
                  'font-medium text-sm',
                  isFuture && 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
