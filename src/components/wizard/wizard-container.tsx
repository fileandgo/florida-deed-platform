'use client';

import { WizardProvider, useWizard } from './wizard-context';
import { StepIndicator } from '@/components/shared/step-indicator';
import { ScenarioSelector } from './scenario-selector';
import { GuidedFlow } from './guided-flow';
import { DocumentTypeSelector } from './document-type-selector';
import { ContactDetailsStep } from './contact-details-step';
import { PropertyDetailsStep } from './property-details-step';
import { TransferDetailsStep } from './transfer-details-step';
import { PartiesStep } from './parties-step';
import { ScreeningStep } from './screening-step';
import { DocumentUploadStep } from './document-upload-step';
import { ReviewPayStep } from './review-pay-step';
import { ConfirmationStep } from './confirmation-step';

const wizardSteps = [
  { label: 'Start' },
  { label: 'Document' },
  { label: 'Contact' },
  { label: 'Property' },
  { label: 'Transfer' },
  { label: 'Parties' },
  { label: 'Screening' },
  { label: 'Documents' },
  { label: 'Review' },
  { label: 'Done' },
];

function WizardContent() {
  const { state } = useWizard();
  const step = state.currentStep;

  // Map logical steps to the indicator
  const indicatorStep = Math.min(Math.floor(step), wizardSteps.length - 1);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <ScenarioSelector />;
      case 0.5:
        return <GuidedFlow />;
      case 1:
        return <DocumentTypeSelector />;
      case 2:
        return <ContactDetailsStep />;
      case 3:
        return <PropertyDetailsStep />;
      case 4:
        return <TransferDetailsStep />;
      case 5:
        return <PartiesStep />;
      case 6:
        return <ScreeningStep />;
      case 7:
        return <DocumentUploadStep />;
      case 8:
        return <ReviewPayStep />;
      case 9:
        return <ConfirmationStep />;
      default:
        return <ScenarioSelector />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {step < 9 && (
        <div className="mb-8">
          <StepIndicator steps={wizardSteps} currentStep={indicatorStep} />
        </div>
      )}
      {renderStep()}
    </div>
  );
}

export function WizardContainer() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
