'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { orderStatusLabels } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FileText, ArrowRight, MapPin } from 'lucide-react';

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string | null;
  propertyCounty: string;
  contactFirstName: string;
  contactLastName: string;
  totalAmount: number | null;
  createdAt: string;
  documentType?: { name: string } | null;
  _count?: { documents: number };
}

function statusVariant(status: string): 'default' | 'success' | 'warning' | 'info' | 'destructive' | 'secondary' {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PAID': case 'IN_PROGRESS': case 'INTAKE_REVIEW': return 'info';
    case 'PAYMENT_PENDING': case 'AWAITING_DOCUMENTS': return 'warning';
    case 'CANCELLED': return 'destructive';
    default: return 'secondary';
  }
}

export function OrderList({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-6">Start your first deed preparation order today.</p>
          <Link href="/wizard">
            <Button className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold">
              Start New Order <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/portal/orders/${order.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <Badge variant={statusVariant(order.status)}>
                      {orderStatusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {order.propertyAddress}, {order.propertyCity}, {order.propertyState || ''}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{order.documentType?.name || 'Pending review'}</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  {order.totalAmount && (
                    <span className="text-lg font-semibold text-brand-teal">
                      {formatCurrency(Number(order.totalAmount))}
                    </span>
                  )}
                  <div className="mt-1">
                    <ArrowRight className="h-4 w-4 text-muted-foreground inline" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
