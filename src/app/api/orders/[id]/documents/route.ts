import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB || '10') || 10) * 1024 * 1024;

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const order = await db.order.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'supporting';

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(UPLOAD_DIR, order.id);
    await mkdir(uploadDir, { recursive: true });

    const uploaded = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        continue;
      }

      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const doc = await db.orderDocument.create({
        data: {
          orderId: order.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          filePath: filePath,
          category,
        },
      });

      uploaded.push(doc);
    }

    if (uploaded.length > 0) {
      await logAudit({
        orderId: order.id,
        userId: session.user.id,
        action: 'documents_uploaded',
        details: { count: uploaded.length, fileNames: uploaded.map((d) => d.fileName) },
      });
    }

    return NextResponse.json({ uploaded }, { status: 201 });
  } catch (err) {
    console.error('Document upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
