import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const order = await db.order.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        documentType: true,
        parties: true,
        documents: { orderBy: { uploadedAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
