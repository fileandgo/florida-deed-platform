export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GuidedQuestion {
  id: string;
  question: string;
  options: GuidedOption[];
}

export interface GuidedOption {
  id: string;
  label: string;
  description?: string;
  nextQuestionId?: string;
  recommendedDocType?: string;
}

export const scenarios: Scenario[] = [
  {
    id: 'add-person',
    title: 'Add someone to my property',
    description: 'Add a spouse, family member, or another person to your property title.',
    icon: 'UserPlus',
  },
  {
    id: 'transfer-trust',
    title: 'Transfer property to a trust',
    description: 'Move your property into a living trust or other trust structure.',
    icon: 'Shield',
  },
  {
    id: 'transfer-family',
    title: 'Transfer property to a family member',
    description: 'Gift or transfer property to a spouse, child, or other family member.',
    icon: 'Heart',
  },
  {
    id: 'remove-person',
    title: 'Remove someone from title',
    description: 'Remove an ex-spouse, deceased person, or another party from property title.',
    icon: 'UserMinus',
  },
  {
    id: 'correct-deed',
    title: 'Correct or update a deed',
    description: 'Fix errors, update names, or make corrections to an existing deed.',
    icon: 'FileEdit',
  },
  {
    id: 'not-sure',
    title: "I'm not sure what I need",
    description: "Answer a few questions and we'll help you find the right path.",
    icon: 'HelpCircle',
  },
  {
    id: 'know-what-i-need',
    title: 'I know what deed I need',
    description: 'Skip the guided process and select your document type directly.',
    icon: 'FileCheck',
  },
];

export const guidedQuestions: GuidedQuestion[] = [
  {
    id: 'transfer-type',
    question: 'What best describes your situation?',
    options: [
      {
        id: 'sale',
        label: 'Selling or buying property',
        description: 'A property transaction with payment involved',
        nextQuestionId: 'recipient-type',
        recommendedDocType: 'warranty-deed',
      },
      {
        id: 'gift',
        label: 'Gifting property (no payment)',
        description: 'Transferring property without any money changing hands',
        nextQuestionId: 'recipient-type',
      },
      {
        id: 'transfer-no-payment',
        label: 'Transferring without sale',
        description: 'Moving property between entities, to a trust, or for estate planning',
        nextQuestionId: 'recipient-type',
      },
      {
        id: 'correction',
        label: 'Correcting or updating an existing deed',
        description: 'Fixing errors, name changes, or other corrections',
        recommendedDocType: 'quitclaim-deed',
      },
    ],
  },
  {
    id: 'recipient-type',
    question: 'Who will be receiving the property?',
    options: [
      {
        id: 'individual',
        label: 'An individual person',
        description: 'A specific person such as a family member or buyer',
        nextQuestionId: 'financing',
      },
      {
        id: 'trust',
        label: 'A trust',
        description: 'A living trust, family trust, or other trust entity',
        nextQuestionId: 'financing',
        recommendedDocType: 'quitclaim-deed',
      },
      {
        id: 'business',
        label: 'A business or entity',
        description: 'An LLC, corporation, or other business entity',
        nextQuestionId: 'financing',
      },
    ],
  },
  {
    id: 'financing',
    question: 'Is there a mortgage or financing involved?',
    options: [
      {
        id: 'yes-financing',
        label: 'Yes, there is a mortgage',
        description: 'The property has an existing mortgage or new financing',
        nextQuestionId: 'property-type',
      },
      {
        id: 'no-financing',
        label: 'No mortgage or financing',
        description: 'The property is owned free and clear',
        nextQuestionId: 'property-type',
      },
      {
        id: 'not-sure-financing',
        label: "I'm not sure",
        description: 'We can help determine this during review',
        nextQuestionId: 'property-type',
      },
    ],
  },
  {
    id: 'property-type',
    question: 'What type of property is this?',
    options: [
      {
        id: 'residential',
        label: 'Residential (home, condo, townhouse)',
        description: 'A property used as a primary or secondary residence',
      },
      {
        id: 'commercial',
        label: 'Commercial property',
        description: 'Office, retail, industrial, or other business property',
      },
      {
        id: 'vacant-land',
        label: 'Vacant land',
        description: 'Undeveloped or raw land',
      },
      {
        id: 'other',
        label: 'Other',
        description: 'Mixed-use, agricultural, or other property type',
      },
    ],
  },
];

// Map scenario + guided answers to a recommended document type
export function getRecommendation(
  scenarioId: string,
  answers: Record<string, string>
): { documentTypeSlug: string; confidence: string; reasoning: string } {
  // Check guided question recommendations
  for (const q of guidedQuestions) {
    const answerId = answers[q.id];
    if (answerId) {
      const option = q.options.find((o) => o.id === answerId);
      if (option?.recommendedDocType) {
        return {
          documentTypeSlug: option.recommendedDocType,
          confidence: 'moderate',
          reasoning: `Based on your response: "${option.label}"`,
        };
      }
    }
  }

  // Scenario-based defaults
  const scenarioDefaults: Record<string, string> = {
    'add-person': 'quitclaim-deed',
    'transfer-trust': 'quitclaim-deed',
    'transfer-family': 'quitclaim-deed',
    'remove-person': 'quitclaim-deed',
    'correct-deed': 'quitclaim-deed',
  };

  const slug = scenarioDefaults[scenarioId] || 'warranty-deed';
  return {
    documentTypeSlug: slug,
    confidence: 'preliminary',
    reasoning: 'Based on the scenario you selected. Our team will confirm the best document type during review.',
  };
}
