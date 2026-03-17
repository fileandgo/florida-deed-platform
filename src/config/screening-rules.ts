export type ScreeningResult = 'standard' | 'enhanced_review' | 'fincen_review';

export interface ScreeningInput {
  transferType: string;
  recipientType: string;
  estimatedValue: number | null;
  hasFinancing: boolean | null;
  propertyType: string;
  grantorCount: number;
  granteeCount: number;
  hasEntityInvolved: boolean;
  hasTrustInvolved: boolean;
  county: string;
}

interface ScreeningRule {
  id: string;
  name: string;
  description: string;
  evaluate: (input: ScreeningInput) => ScreeningResult | null;
  priority: number;
}

const screeningRules: ScreeningRule[] = [
  {
    id: 'high-value-entity',
    name: 'High-value entity transfer',
    description: 'Entity transfers above $300,000 may require FinCEN review',
    priority: 1,
    evaluate: (input) => {
      if (input.hasEntityInvolved && input.estimatedValue && input.estimatedValue > 300000) {
        return 'fincen_review';
      }
      return null;
    },
  },
  {
    id: 'entity-no-financing',
    name: 'Entity transfer without financing',
    description: 'Entity transfers without traditional financing warrant enhanced review',
    priority: 2,
    evaluate: (input) => {
      if (input.hasEntityInvolved && input.hasFinancing === false) {
        return 'enhanced_review';
      }
      return null;
    },
  },
  {
    id: 'high-value-cash',
    name: 'High-value cash transaction',
    description: 'Cash transactions above $300,000 warrant enhanced review',
    priority: 3,
    evaluate: (input) => {
      if (input.estimatedValue && input.estimatedValue > 300000 && input.hasFinancing === false) {
        return 'enhanced_review';
      }
      return null;
    },
  },
  {
    id: 'multiple-parties',
    name: 'Multiple parties involved',
    description: 'Transactions with many parties may need additional review',
    priority: 4,
    evaluate: (input) => {
      if (input.grantorCount + input.granteeCount > 4) {
        return 'enhanced_review';
      }
      return null;
    },
  },
];

export function evaluateScreening(input: ScreeningInput): {
  result: ScreeningResult;
  triggeredRules: string[];
  details: Record<string, unknown>;
} {
  const triggeredRules: string[] = [];
  let highestResult: ScreeningResult = 'standard';

  const sortedRules = [...screeningRules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    const ruleResult = rule.evaluate(input);
    if (ruleResult) {
      triggeredRules.push(rule.id);
      if (ruleResult === 'fincen_review') {
        highestResult = 'fincen_review';
      } else if (ruleResult === 'enhanced_review' && highestResult !== 'fincen_review') {
        highestResult = 'enhanced_review';
      }
    }
  }

  return {
    result: highestResult,
    triggeredRules,
    details: { rulesEvaluated: screeningRules.length, input },
  };
}
