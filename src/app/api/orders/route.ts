import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderSubmittedEmail } from '@/lib/email';
import { getDocumentTypeBySlug } from '@/config/document-types';
import { z } from 'zod';

const createOrderBody = z.object({
  scenarioType: z.string().nullable().optional(),
  documentTypeSlug: z.string().nullable().optional(),
  contact: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    mailingAddress: z.string().optional(),
    mailingCity: z.string().optional(),
    mailingState: z.string().optional(),
    mailingZip: z.string().optional(),
  }),
  property: z.object({
    state: z.string(),
    county: z.string(),
    address: z.string(),
    city: z.string(),
    zip: z.string(),
    propertyType: z.string().optional(),
    parcelFolio: z.string().optional(),
  }),
  transfer: z.object({
    reason: z.string().optional(),
    estimatedValue: z.number().optional(),
    hasFinancing: z.boolean().optional(),
    specialNotes: z.string().optional(),
  }).optional(),
  parties: z.array(z.object({
    role: z.enum(['GRANTOR', 'GRANTEE']),
    name: z.string(),
    entityType: z.enum(['INDIVIDUAL', 'TRUST', 'ENTITY']),
    entityName: z.string().optional(),
  })),
  screeningResult: z.string().nullable().optional(),
  screeningData: z.any().optional(),
  uploadedDocuments: z.array(z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const data = createOrderBody.parse(body);

    // Look up document type in DB or use config
    let documentTypeId: string | null = null;
    let docConfig = data.documentTypeSlug ? getDocumentTypeBySlug(data.documentTypeSlug) : null;

    if (data.documentTypeSlug) {
      const dbDocType = await db.documentType.findUnique({
        where: { slug: data.documentTypeSlug },
      });
      if (dbDocType) documentTypeId = dbDocType.id;
    }

    const serviceFee = docConfig?.baseFee || 399;
    const recordingFee = docConfig?.estimatedRecordingFee || 35;
    const totalAmount = serviceFee + recordingFee;

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        status: 'SUBMITTED',
        scenarioType: data.scenarioType,
        documentTypeId,
        contactFirstName: data.contact.firstName,
        contactLastName: data.contact.lastName,
        contactEmail: data.contact.email,
        contactPhone: data.contact.phone,
        mailingAddress: data.contact.mailingAddress,
        mailingCity: data.contact.mailingCity,
        mailingState: data.contact.mailingState,
        mailingZip: data.contact.mailingZip,
        propertyState: data.property.state,
        propertyCounty: data.property.county,
        propertyAddress: data.property.address,
        propertyCity: data.property.city,
        propertyZip: data.property.zip,
        propertyType: data.property.propertyType,
        parcelFolio: data.property.parcelFolio,
        transferReason: data.transfer?.reason,
        estimatedValue: data.transfer?.estimatedValue,
        hasFinancing: data.transfer?.hasFinancing,
        specialNotes: data.transfer?.specialNotes,
        screeningResult: data.screeningResult,
        screeningData: data.screeningData || {},
        serviceFee,
        recordingFee,
        totalAmount,
        parties: {
          create: data.parties.map((p) => ({
            role: p.role,
            name: p.name,
            entityType: p.entityType,
            entityName: p.entityName,
          })),
        },
      },
      include: { parties: true },
    });

    await logAudit({
      orderId: order.id,
      userId: session.user.id,
      action: 'order_created',
      details: { orderNumber: order.orderNumber, documentTypeSlug: data.documentTypeSlug },
    });

    // Send confirmation email
    await sendOrderSubmittedEmail(
      data.contact.email,
      order.orderNumber,
      docConfig?.name || 'Deed Preparation'
    ).catch(console.error);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid order data', details: err.errors }, { status: 400 });
    }
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        documentType: true,
        parties: true,
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error('List orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
