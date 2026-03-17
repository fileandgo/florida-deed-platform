// State and county data - extensible for future markets

export interface StateConfig {
  code: string;
  name: string;
  counties: string[];
}

export const supportedStates: StateConfig[] = [
  {
    code: 'FL',
    name: 'Florida',
    counties: [
      'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward',
      'Calhoun', 'Charlotte', 'Citrus', 'Clay', 'Collier', 'Columbia',
      'DeSoto', 'Dixie', 'Duval', 'Escambia', 'Flagler', 'Franklin',
      'Gadsden', 'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee',
      'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes',
      'Indian River', 'Jackson', 'Jefferson', 'Lafayette', 'Lake',
      'Lee', 'Leon', 'Levy', 'Liberty', 'Madison', 'Manatee',
      'Marion', 'Martin', 'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa',
      'Okeechobee', 'Orange', 'Osceola', 'Palm Beach', 'Pasco',
      'Pinellas', 'Polk', 'Putnam', 'Santa Rosa', 'Sarasota',
      'Seminole', 'St. Johns', 'St. Lucie', 'Sumter', 'Suwannee',
      'Taylor', 'Union', 'Volusia', 'Wakulla', 'Walton', 'Washington',
    ],
  },
  // Add more states here as the platform expands
];

export function getCountiesForState(stateCode: string): string[] {
  const state = supportedStates.find((s) => s.code === stateCode);
  return state?.counties ?? [];
}

export function getSupportedStateNames(): string[] {
  return supportedStates.map((s) => s.name);
}

export function getSupportedStateCodes(): string[] {
  return supportedStates.map((s) => s.code);
}
