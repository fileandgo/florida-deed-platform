import { z } from 'zod';

// --- Form Validation Schemas ---

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  mailingAddress: z.string().optional(),
  mailingCity: z.string().optional(),
  mailingState: z.string().optional(),
  mailingZip: z.string().optional(),
});

export const propertySchema = z.object({
  state: z.string().min(1, 'State is required'),
  county: z.string().min(1, 'County is required'),
  address: z.string().min(1, 'Property address is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(5, 'Valid zip code is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  parcelFolio: z.string().optional(),
});

export const transferSchema = z.object({
  reason: z.string().min(1, 'Transfer reason is required'),
  estimatedValue: z.number().optional(),
  hasFinancing: z.boolean().optional(),
  specialNotes: z.string().optional(),
});

export const partySchema = z.object({
  role: z.enum(['GRANTOR', 'GRANTEE']),
  name: z.string().min(1, 'Name is required'),
  entityType: z.enum(['INDIVIDUAL', 'TRUST', 'ENTITY']),
  entityName: z.string().optional(),
});

export const screeningSchema = z.object({
  transferType: z.string(),
  recipientType: z.string(),
  estimatedValue: z.number().nullable(),
  hasFinancing: z.boolean().nullable(),
  propertyType: z.string(),
  hasEntityInvolved: z.boolean(),
  hasTrustInvolved: z.boolean(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// --- Wizard State ---

export interface WizardState {
  currentStep: number;
  scenario: string | null;
  documentTypeId: string | null;
  guidedAnswers: Record<string, string>;
  contact: z.infer<typeof contactSchema> | null;
  property: z.infer<typeof propertySchema> | null;
  transfer: z.infer<typeof transferSchema> | null;
  parties: z.infer<typeof partySchema>[];
  screeningData: z.infer<typeof screeningSchema> | null;
  screeningResult: string | null;
  uploadedDocuments: UploadedDocument[];
  orderId: string | null;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
}

// --- Order Status ---

export const orderStatusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PAYMENT_PENDING: 'Payment Pending',
  PAID: 'Paid',
  INTAKE_REVIEW: 'Intake Review',
  AWAITING_DOCUMENTS: 'Awaiting Documents',
  IN_PROGRESS: 'In Progress',
  TITLE_SEARCH: 'Title Search',
  ATTORNEY_REVIEW: 'Attorney Review',
  NOTARIZATION: 'Notarization',
  RECORDING: 'Recording',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const statusSteps = [
  { key: 'SUBMITTED', label: 'Submitted', description: 'Your order has been received' },
  { key: 'PAID', label: 'Payment Confirmed', description: 'Payment has been processed' },
  { key: 'INTAKE_REVIEW', label: 'Intake Review', description: 'Our team is reviewing your information' },
  { key: 'IN_PROGRESS', label: 'In Progress', description: 'Your deed is being prepared' },
  { key: 'COMPLETED', label: 'Completed', description: 'Your deed is ready' },
];
