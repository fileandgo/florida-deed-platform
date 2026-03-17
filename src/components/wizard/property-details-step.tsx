'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/types';
import { supportedStates, getCountiesForState } from '@/config/geography';
import { useWizard } from './wizard-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { z } from 'zod';

type PropertyForm = z.infer<typeof propertySchema>;

export function PropertyDetailsStep() {
  const { state, dispatch } = useWizard();
  const [selectedState, setSelectedState] = useState(state.property?.state || '');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: state.property || { state: '', county: '', address: '', city: '', zip: '', propertyType: '' },
  });

  const counties = getCountiesForState(selectedState);

  const onSubmit = (data: PropertyForm) => {
    dispatch({ type: 'SET_PROPERTY', property: data });
    dispatch({ type: 'SET_STEP', step: 4 });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Property Information</h2>
        <p className="text-muted-foreground mt-1">Tell us about the property involved in this transaction.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-brand-teal" /> Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>State *</Label>
                <Select
                  value={selectedState}
                  onValueChange={(val) => {
                    setSelectedState(val);
                    setValue('state', val);
                    setValue('county', '');
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {supportedStates.map((s) => (
                      <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <Label>County *</Label>
                <Select
                  value={state.property?.county || ''}
                  onValueChange={(val) => setValue('county', val)}
                  disabled={!selectedState}
                >
                  <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                  <SelectContent>
                    {counties.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.county && <p className="text-xs text-destructive mt-1">{errors.county.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input id="address" {...register('address')} placeholder="123 Main Street" />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register('city')} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="zip">Zip Code *</Label>
                <Input id="zip" {...register('zip')} placeholder="33101" />
                {errors.zip && <p className="text-xs text-destructive mt-1">{errors.zip.message}</p>}
              </div>
            </div>

            <div>
              <Label>Property Type *</Label>
              <Select onValueChange={(val) => setValue('propertyType', val)} defaultValue={state.property?.propertyType}>
                <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential (Home, Condo, Townhouse)</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="vacant-land">Vacant Land</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.propertyType && <p className="text-xs text-destructive mt-1">{errors.propertyType.message}</p>}
            </div>

            <div>
              <Label htmlFor="parcelFolio">Parcel / Folio Number (optional)</Label>
              <Input id="parcelFolio" {...register('parcelFolio')} placeholder="If available" />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>
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
