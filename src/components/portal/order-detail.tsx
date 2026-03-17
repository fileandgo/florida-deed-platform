'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatusTimeline } from './status-timeline';
import { orderStatusLabels } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FileText, User, MapPin, Users, CreditCard, Calendar } from 'lucide-react';

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  scenarioType: string | null;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string | null;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string | null;
  propertyZip: string;
  propertyCounty: string;
  propertyType: string | null;
  transferReason: string | null;
  estimatedValue: number | null;
  hasFinancing: boolean | null;
  specialNotes: string | null;
  screeningResult: string | null;
  serviceFee: number | null;
  recordingFee: number | null;
  totalAmount: number | null;
  paidAt: string | null;
  createdAt: string;
  documentType?: { name: string } | null;
  parties: { id: string; role: string; name: string; entityType: string; entityName: string | null }[];
  documents: { id: string; fileName: string; fileSize: number; uploadedAt: string; category: string | null }[];
}

export function OrderDetail({ order }: { order: OrderData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{order.orderNumber}</h2>
                <p className="text-sm text-muted-foreground">Created {formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'PAID' ? 'info' : 'secondary'} className="text-sm">
                {orderStatusLabels[order.status] || order.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Document type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-teal" /> Document Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.documentType?.name || 'To be determined during review'}</p>
            {order.screeningResult && order.screeningResult !== 'standard' && (
              <Badge variant="warning" className="mt-2">
                {order.screeningResult === 'fincen_review' ? 'Compliance Review' : 'Enhanced Review'}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-brand-teal" /> Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{order.contactFirstName} {order.contactLastName}</p>
            <p className="text-muted-foreground">{order.contactEmail}</p>
            {order.contactPhone && <p className="text-muted-foreground">{order.contactPhone}</p>}
          </CardContent>
        </Card>

        {/* Property */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-teal" /> Property
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{order.propertyAddress}</p>
            <p>{order.propertyCity}, {order.propertyState} {order.propertyZip}</p>
            <p className="text-muted-foreground">{order.propertyCounty} County</p>
            {order.propertyType && <p className="text-muted-foreground capitalize">{order.propertyType}</p>}
          </CardContent>
        </Card>

        {/* Parties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-teal" /> Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Grantor(s)</p>
                {order.parties.filter((p) => p.role === 'GRANTOR').map((p) => (
                  <p key={p.id} className="text-muted-foreground">
                    {p.name}
                    {p.entityType !== 'INDIVIDUAL' && <span className="text-xs"> ({p.entityType})</span>}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-medium mb-1">Grantee(s)</p>
                {order.parties.filter((p) => p.role === 'GRANTEE').map((p) => (
                  <p key={p.id} className="text-muted-foreground">
                    {p.name}
                    {p.entityType !== 'INDIVIDUAL' && <span className="text-xs"> ({p.entityType})</span>}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        {order.documents.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Documents ({order.documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {order.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span>{doc.fileName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* Status timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline currentStatus={order.status} />
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand-teal" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{order.serviceFee ? formatCurrency(Number(order.serviceFee)) : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>Recording Fee</span>
                <span>{order.recordingFee ? formatCurrency(Number(order.recordingFee)) : '-'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-brand-teal">{order.totalAmount ? formatCurrency(Number(order.totalAmount)) : '-'}</span>
              </div>
              {order.paidAt && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Paid {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
