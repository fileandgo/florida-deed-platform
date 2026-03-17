import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { OrderList } from '@/components/portal/order-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function PortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login?callbackUrl=/portal');

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      documentType: true,
      _count: { select: { documents: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const serialized = orders.map((o) => ({
    ...o,
    totalAmount: o.totalAmount ? Number(o.totalAmount) : null,
    serviceFee: o.serviceFee ? Number(o.serviceFee) : null,
    recordingFee: o.recordingFee ? Number(o.recordingFee) : null,
    estimatedValue: o.estimatedValue ? Number(o.estimatedValue) : null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    paidAt: o.paidAt?.toISOString() || null,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <Link href="/wizard">
          <Button className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold">
            <Plus className="h-4 w-4 mr-2" /> New Order
          </Button>
        </Link>
      </div>

      <OrderList orders={serialized as any} />
    </div>
  );
}
