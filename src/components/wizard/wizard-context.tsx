'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { WizardState } from '@/types';

const initialState: WizardState = {
  currentStep: 0,
  scenario: null,
  documentTypeId: null,
  guidedAnswers: {},
  contact: null,
  property: null,
  transfer: null,
  parties: [],
  screeningData: null,
  screeningResult: null,
  uploadedDocuments: [],
  orderId: null,
};

type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_SCENARIO'; scenario: string }
  | { type: 'SET_DOCUMENT_TYPE'; documentTypeId: string }
  | { type: 'SET_GUIDED_ANSWER'; questionId: string; answerId: string }
  | { type: 'SET_CONTACT'; contact: WizardState['contact'] }
  | { type: 'SET_PROPERTY'; property: WizardState['property'] }
  | { type: 'SET_TRANSFER'; transfer: WizardState['transfer'] }
  | { type: 'SET_PARTIES'; parties: WizardState['parties'] }
  | { type: 'SET_SCREENING'; data: WizardState['screeningData']; result: string }
  | { type: 'ADD_DOCUMENT'; document: WizardState['uploadedDocuments'][0] }
  | { type: 'REMOVE_DOCUMENT'; documentId: string }
  | { type: 'SET_ORDER_ID'; orderId: string }
  | { type: 'RESET' };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_SCENARIO':
      return { ...state, scenario: action.scenario };
    case 'SET_DOCUMENT_TYPE':
      return { ...state, documentTypeId: action.documentTypeId };
    case 'SET_GUIDED_ANSWER':
      return { ...state, guidedAnswers: { ...state.guidedAnswers, [action.questionId]: action.answerId } };
    case 'SET_CONTACT':
      return { ...state, contact: action.contact };
    case 'SET_PROPERTY':
      return { ...state, property: action.property };
    case 'SET_TRANSFER':
      return { ...state, transfer: action.transfer };
    case 'SET_PARTIES':
      return { ...state, parties: action.parties };
    case 'SET_SCREENING':
      return { ...state, screeningData: action.data, screeningResult: action.result };
    case 'ADD_DOCUMENT':
      return { ...state, uploadedDocuments: [...state.uploadedDocuments, action.document] };
    case 'REMOVE_DOCUMENT':
      return { ...state, uploadedDocuments: state.uploadedDocuments.filter((d) => d.id !== action.documentId) };
    case 'SET_ORDER_ID':
      return { ...state, orderId: action.orderId };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}
