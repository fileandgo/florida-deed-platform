import { db } from './db';

export type AuditAction =
  | 'order_created'
  | 'recommendation_generated'
  | 'details_updated'
  | 'documents_uploaded'
  | 'payment_initiated'
  | 'payment_confirmed'
  | 'status_changed'
  | 'screening_completed'
  | 'user_registered'
  | 'user_logged_in';

export async function logAudit(params: {
  orderId?: string;
  userId?: string;
  action: AuditAction;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  return db.auditLog.create({
    data: {
      orderId: params.orderId,
      userId: params.userId,
      action: params.action,
      details: params.details ?? {},
      ipAddress: params.ipAddress,
    },
  });
}
