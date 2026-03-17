import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { OrderDetail } from '@/components/portal/order-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/portal');

  const order = await db.order.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      documentType: true,
      parties: true,
      documents: { orderBy: { uploadedAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!order) notFound();

  // Serialize Decimal and Date fields
  const serialized = {
    ...order,
    totalAmount: order.totalAmount ? Number(order.totalAmount) : null,
    serviceFee: order.serviceFee ? Number(order.serviceFee) : null,
    recordingFee: order.recordingFee ? Number(order.recordingFee) : null,
    estimatedValue: order.estimatedValue ? Number(order.estimatedValue) : null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    paidAt: order.paidAt?.toISOString() || null,
    parties: order.parties.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
    documents: order.documents.map((d) => ({
      ...d,
      uploadedAt: d.uploadedAt.toISOString(),
    })),
    payments: order.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/portal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Button>
        </Link>
      </div>
      <OrderDetail order={serialized as any} />
    </div>
  );
}
