'use client';

import { useState } from 'react';
import { useWizard } from './wizard-context';
import { FileUpload } from '@/components/shared/file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Paperclip } from 'lucide-react';

export function DocumentUploadStep() {
  const { state, dispatch } = useWizard();
  const [uploading, setUploading] = useState(false);

  const handleUpload = (files: File[]) => {
    for (const file of files) {
      const doc = {
        id: crypto.randomUUID(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        category: 'supporting',
      };
      dispatch({ type: 'ADD_DOCUMENT', document: doc });
    }
  };

  const handleRemove = (docId: string) => {
    dispatch({ type: 'REMOVE_DOCUMENT', documentId: docId });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Supporting Documents</h2>
        <p className="text-muted-foreground mt-1">
          Upload any supporting documents you have available. You can also upload documents later from your portal.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Paperclip className="h-5 w-5 text-brand-teal" /> Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Common documents that may help us process your order:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Existing deed or title document</li>
              <li>Trust documents (if transferring to/from a trust)</li>
              <li>Death certificate (if applicable)</li>
              <li>Government-issued ID</li>
              <li>Any other relevant supporting documents</li>
            </ul>
          </div>

          <FileUpload
            onUpload={handleUpload}
            existingFiles={state.uploadedDocuments.map((d) => ({
              id: d.id,
              fileName: d.fileName,
              fileSize: d.fileSize,
            }))}
            onRemove={handleRemove}
          />
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Don't have all your documents ready? No problem. You can upload them later from your customer portal
          after submitting your order.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 6 })}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={() => dispatch({ type: 'SET_STEP', step: 8 })}
          className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold"
        >
          Continue to Review <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
