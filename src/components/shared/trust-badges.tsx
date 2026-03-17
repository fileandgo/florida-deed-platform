import { Shield, Scale, FileCheck, Clock } from 'lucide-react';

const badges = [
  {
    icon: Scale,
    title: 'Attorney Reviewed',
    description: 'Every deed is reviewed by a licensed attorney',
  },
  {
    icon: Shield,
    title: 'Title Verified',
    description: 'We verify title details before preparation',
  },
  {
    icon: FileCheck,
    title: 'Recording Support',
    description: 'We handle submission to the county recorder',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Most orders completed within 3-5 business days',
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div key={badge.title} className="flex flex-col items-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 mb-3">
            <badge.icon className="h-6 w-6 text-brand-teal" />
          </div>
          <h4 className="text-sm font-semibold">{badge.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
