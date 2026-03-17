import { NextResponse } from 'next/server';
import { getRecommendation } from '@/config/scenarios';
import { getDocumentTypeBySlug } from '@/config/document-types';
import { logAudit } from '@/lib/audit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { scenarioId, answers } = await request.json();

    const recommendation = getRecommendation(scenarioId, answers || {});
    const docType = getDocumentTypeBySlug(recommendation.documentTypeSlug);

    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      await logAudit({
        userId: session.user.id,
        action: 'recommendation_generated',
        details: { scenarioId, answers, recommendation },
      }).catch(console.error);
    }

    return NextResponse.json({
      recommendation: {
        documentTypeSlug: recommendation.documentTypeSlug,
        documentTypeName: docType?.name || 'Deed Preparation',
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        baseFee: docType?.baseFee,
        estimatedRecordingFee: docType?.estimatedRecordingFee,
      },
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
