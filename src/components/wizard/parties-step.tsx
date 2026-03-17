'use client';

import { useState } from 'react';
import { useWizard } from './wizard-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Users, Plus, Trash2 } from 'lucide-react';
import type { z } from 'zod';
import type { partySchema } from '@/types';

type Party = z.infer<typeof partySchema>;

export function PartiesStep() {
  const { state, dispatch } = useWizard();
  const [parties, setParties] = useState<Party[]>(
    state.parties.length > 0
      ? state.parties
      : [
          { role: 'GRANTOR', name: '', entityType: 'INDIVIDUAL', entityName: '' },
          { role: 'GRANTEE', name: '', entityType: 'INDIVIDUAL', entityName: '' },
        ]
  );

  const addParty = (role: 'GRANTOR' | 'GRANTEE') => {
    setParties([...parties, { role, name: '', entityType: 'INDIVIDUAL', entityName: '' }]);
  };

  const removeParty = (index: number) => {
    if (parties.length <= 2) return;
    setParties(parties.filter((_, i) => i !== index));
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    const updated = [...parties];
    (updated[index] as any)[field] = value;
    setParties(updated);
  };

  const handleContinue = () => {
    const valid = parties.every((p) => p.name.trim().length > 0);
    if (!valid) return;
    dispatch({ type: 'SET_PARTIES', parties });
    dispatch({ type: 'SET_STEP', step: 6 });
  };

  const grantors = parties.filter((p) => p.role === 'GRANTOR');
  const grantees = parties.filter((p) => p.role === 'GRANTEE');

  const renderPartyList = (list: Party[], role: 'GRANTOR' | 'GRANTEE', label: string) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{label} (Transferring {role === 'GRANTOR' ? 'From' : 'To'})</span>
          <Button type="button" variant="outline" size="sm" onClick={() => addParty(role)}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.map((party) => {
          const globalIndex = parties.indexOf(party);
          return (
            <div key={globalIndex} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{role === 'GRANTOR' ? 'Grantor' : 'Grantee'} {list.indexOf(party) + 1}</span>
                {parties.length > 2 && (
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeParty(globalIndex)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={party.name}
                  onChange={(e) => updateParty(globalIndex, 'name', e.target.value)}
                  placeholder="Enter full legal name"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={party.entityType}
                  onValueChange={(val) => updateParty(globalIndex, 'entityType', val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="TRUST">Trust</SelectItem>
                    <SelectItem value="ENTITY">Business / Entity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {party.entityType !== 'INDIVIDUAL' && (
                <div>
                  <Label>Entity / Trust Name</Label>
                  <Input
                    value={party.entityName || ''}
                    onChange={(e) => updateParty(globalIndex, 'entityName', e.target.value)}
                    placeholder={party.entityType === 'TRUST' ? 'e.g. Smith Family Trust' : 'e.g. ABC Holdings LLC'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Parties Involved</h2>
        <p className="text-muted-foreground mt-1">Identify who is transferring the property and who is receiving it.</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-brand-teal" />
        <span className="font-medium">Grantor(s) & Grantee(s)</span>
      </div>

      {renderPartyList(grantors, 'GRANTOR', 'Grantor(s)')}
      {renderPartyList(grantees, 'GRANTEE', 'Grantee(s)')}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!parties.every((p) => p.name.trim().length > 0)}
          className="bg-brand-teal text-brand-navy hover:bg-brand-teal/90 font-semibold"
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
