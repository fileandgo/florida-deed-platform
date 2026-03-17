'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferSchema } from '@/types';
import { useWizard } from './wizard-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, ArrowLeftRight } from 'lucide-react';
import type { z } from 'zod';

type TransferForm = z.infer<typeof transferSchema>;

export function TransferDetailsStep() {
  const { state, dispatch } = useWizard();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: state.transfer || {},
  });

  const hasFinancing = watch('hasFinancing');

  const onSubmit = (data: TransferForm) => {
    dispatch({ type: 'SET_TRANSFER', transfer: data });
    dispatch({ type: 'SET_STEP', step: 5 });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Transfer Details</h2>
        <p className="text-muted-foreground mt-1">Provide details about the property transfer.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowLeftRight className="h-5 w-5 text-brand-teal" /> Transfer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Reason for Transfer *</Label>
              <Select onValueChange={(val) => setValue('reason', val)} defaultValue={state.transfer?.reason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale / Purchase</SelectItem>
                  <SelectItem value="gift">Gift (no consideration)</SelectItem>
                  <SelectItem value="trust-transfer">Transfer to/from Trust</SelectItem>
                  <SelectItem value="estate-planning">Estate Planning</SelectItem>
                  <SelectItem value="divorce">Divorce / Separation</SelectItem>
                  <SelectItem value="add-remove-party">Add or Remove a Party</SelectItem>
                  <SelectItem value="correction">Deed Correction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason.message}</p>}
            </div>

            <div>
              <Label htmlFor="estimatedValue">Estimated Property Value</Label>
              <Input
                id="estimatedValue"
                type="number"
                placeholder="e.g. 350000"
                {...register('estimatedValue', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground mt-1">This helps us assess any compliance requirements.</p>
            </div>

            <div>
              <Label>Is there a mortgage or financing involved?</Label>
              <RadioGroup
                defaultValue={hasFinancing === true ? 'yes' : hasFinancing === false ? 'no' : undefined}
                onValueChange={(val) => setValue('hasFinancing', val === 'yes')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fin-yes" />
                  <Label htmlFor="fin-yes" className="font-normal">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fin-no" />
                  <Label htmlFor="fin-no" className="font-normal">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="specialNotes">Special Circumstances or Notes</Label>
              <Textarea
                id="specialNotes"
                {...register('specialNotes')}
                placeholder="Any additional details that might be relevant..."
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="submit" className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
