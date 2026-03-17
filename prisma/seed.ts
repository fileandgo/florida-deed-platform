import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Document Types ---
  const docTypes = [
    {
      name: 'Warranty Deed',
      slug: 'warranty-deed',
      description: 'Provides the highest level of protection to the buyer. The grantor guarantees clear title and the right to sell the property.',
      useCaseHint: 'Best for property sales where the buyer wants maximum protection.',
      baseFee: 399,
      estRecFee: 35,
      sortOrder: 1,
    },
    {
      name: 'Quitclaim Deed',
      slug: 'quitclaim-deed',
      description: 'Transfers whatever interest the grantor has in the property without any warranties about the title.',
      useCaseHint: 'Common for transfers between family members, to trusts, or divorce situations.',
      baseFee: 349,
      estRecFee: 35,
      sortOrder: 2,
    },
    {
      name: 'Special Warranty Deed',
      slug: 'special-warranty-deed',
      description: 'The grantor warrants only against title defects that occurred during their period of ownership.',
      useCaseHint: 'Often used in commercial transactions or corporate transfers.',
      baseFee: 399,
      estRecFee: 35,
      sortOrder: 3,
    },
    {
      name: 'Lady Bird Deed',
      slug: 'ladybird-deed',
      description: 'An enhanced life estate deed that allows the property to pass to beneficiaries at death while retaining full control during life.',
      useCaseHint: 'Popular for estate planning — avoids probate while retaining control.',
      baseFee: 449,
      estRecFee: 35,
      sortOrder: 4,
    },
    {
      name: 'Life Estate Deed',
      slug: 'life-estate-deed',
      description: 'Grants a life interest in the property to one party, with the property passing to a designated remainderman upon death.',
      useCaseHint: 'Used in estate planning when you want to designate future ownership.',
      baseFee: 399,
      estRecFee: 35,
      sortOrder: 5,
    },
  ];

  for (const dt of docTypes) {
    await prisma.documentType.upsert({
      where: { slug: dt.slug },
      update: dt,
      create: dt,
    });
  }
  console.log(`Seeded ${docTypes.length} document types`);

  // --- Demo Customer ---
  const demoPassword = await bcrypt.hash('demo1234', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@fileandgo.com' },
    update: {},
    create: {
      email: 'demo@fileandgo.com',
      passwordHash: demoPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '(305) 555-0123',
      role: 'CUSTOMER',
    },
  });
  console.log(`Demo user: ${demoUser.email} / demo1234`);

  // --- Demo Orders ---
  const warrantyDeed = await prisma.documentType.findUnique({ where: { slug: 'warranty-deed' } });
  const quitclaimDeed = await prisma.documentType.findUnique({ where: { slug: 'quitclaim-deed' } });

  // Order 1 - Completed
  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'FG-DEMO-0001' },
    update: {},
    create: {
      orderNumber: 'FG-DEMO-0001',
      userId: demoUser.id,
      status: 'COMPLETED',
      scenarioType: 'transfer-family',
      documentTypeId: quitclaimDeed?.id,
      contactFirstName: 'Jane',
      contactLastName: 'Smith',
      contactEmail: 'demo@fileandgo.com',
      contactPhone: '(305) 555-0123',
      propertyState: 'FL',
      propertyCounty: 'Miami-Dade',
      propertyAddress: '1234 Palm Avenue',
      propertyCity: 'Miami',
      propertyZip: '33101',
      propertyType: 'residential',
      transferReason: 'gift',
      estimatedValue: 450000,
      hasFinancing: false,
      screeningResult: 'standard',
      serviceFee: 349,
      recordingFee: 35,
      totalAmount: 384,
      paidAt: new Date('2025-12-15'),
      parties: {
        create: [
          { role: 'GRANTOR', name: 'Jane Smith', entityType: 'INDIVIDUAL' },
          { role: 'GRANTEE', name: 'Robert Smith', entityType: 'INDIVIDUAL' },
        ],
      },
    },
  });

  // Order 2 - In Progress
  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'FG-DEMO-0002' },
    update: {},
    create: {
      orderNumber: 'FG-DEMO-0002',
      userId: demoUser.id,
      status: 'IN_PROGRESS',
      scenarioType: 'transfer-trust',
      documentTypeId: quitclaimDeed?.id,
      contactFirstName: 'Jane',
      contactLastName: 'Smith',
      contactEmail: 'demo@fileandgo.com',
      contactPhone: '(305) 555-0123',
      propertyState: 'FL',
      propertyCounty: 'Broward',
      propertyAddress: '5678 Ocean Drive',
      propertyCity: 'Fort Lauderdale',
      propertyZip: '33301',
      propertyType: 'residential',
      transferReason: 'trust-transfer',
      estimatedValue: 680000,
      hasFinancing: true,
      screeningResult: 'standard',
      serviceFee: 349,
      recordingFee: 35,
      totalAmount: 384,
      paidAt: new Date('2026-02-20'),
      parties: {
        create: [
          { role: 'GRANTOR', name: 'Jane Smith', entityType: 'INDIVIDUAL' },
          { role: 'GRANTEE', name: 'Smith Family Trust', entityType: 'TRUST', entityName: 'Smith Family Living Trust' },
        ],
      },
    },
  });

  // Order 3 - Payment Pending
  const order3 = await prisma.order.upsert({
    where: { orderNumber: 'FG-DEMO-0003' },
    update: {},
    create: {
      orderNumber: 'FG-DEMO-0003',
      userId: demoUser.id,
      status: 'PAYMENT_PENDING',
      scenarioType: 'add-person',
      documentTypeId: warrantyDeed?.id,
      contactFirstName: 'Jane',
      contactLastName: 'Smith',
      contactEmail: 'demo@fileandgo.com',
      propertyState: 'FL',
      propertyCounty: 'Orange',
      propertyAddress: '910 Lake View Lane',
      propertyCity: 'Orlando',
      propertyZip: '32801',
      propertyType: 'residential',
      transferReason: 'add-remove-party',
      estimatedValue: 320000,
      hasFinancing: true,
      screeningResult: 'standard',
      serviceFee: 399,
      recordingFee: 35,
      totalAmount: 434,
      parties: {
        create: [
          { role: 'GRANTOR', name: 'Jane Smith', entityType: 'INDIVIDUAL' },
          { role: 'GRANTEE', name: 'Jane Smith', entityType: 'INDIVIDUAL' },
          { role: 'GRANTEE', name: 'Michael Smith', entityType: 'INDIVIDUAL' },
        ],
      },
    },
  });

  // Audit logs for demo orders
  await prisma.auditLog.createMany({
    data: [
      { orderId: order1.id, userId: demoUser.id, action: 'order_created', details: {} },
      { orderId: order1.id, userId: demoUser.id, action: 'payment_confirmed', details: {} },
      { orderId: order1.id, action: 'status_changed', details: { from: 'PAID', to: 'COMPLETED' } },
      { orderId: order2.id, userId: demoUser.id, action: 'order_created', details: {} },
      { orderId: order2.id, userId: demoUser.id, action: 'payment_confirmed', details: {} },
      { orderId: order2.id, action: 'status_changed', details: { from: 'PAID', to: 'IN_PROGRESS' } },
      { orderId: order3.id, userId: demoUser.id, action: 'order_created', details: {} },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded 3 demo orders with audit logs');
  console.log('\nSeed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
