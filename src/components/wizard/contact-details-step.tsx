'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/types';
import { useWizard } from './wizard-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import type { z } from 'zod';

type ContactForm = z.infer<typeof contactSchema>;

export function ContactDetailsStep() {
  const { state, dispatch } = useWizard();

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: state.contact || {},
  });

  const onSubmit = (data: ContactForm) => {
    dispatch({ type: 'SET_CONTACT', contact: data });
    dispatch({ type: 'SET_STEP', step: 3 });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Your Contact Information</h2>
        <p className="text-muted-foreground mt-1">We'll use this to communicate about your order.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-brand-teal" /> Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Mailing Address (optional)</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="mailingAddress">Street Address</Label>
                  <Input id="mailingAddress" {...register('mailingAddress')} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="mailingCity">City</Label>
                    <Input id="mailingCity" {...register('mailingCity')} />
                  </div>
                  <div>
                    <Label htmlFor="mailingState">State</Label>
                    <Input id="mailingState" {...register('mailingState')} />
                  </div>
                  <div>
                    <Label htmlFor="mailingZip">Zip</Label>
                    <Input id="mailingZip" {...register('mailingZip')} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: state.scenario === 'know-what-i-need' ? 1 : 0 })}>
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
