export interface DocumentTypeConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  useCaseHint: string;
  baseFee: number;
  estimatedRecordingFee: number;
}

export const documentTypes: DocumentTypeConfig[] = [
  {
    id: 'warranty-deed',
    name: 'Warranty Deed',
    slug: 'warranty-deed',
    description:
      'Provides the highest level of protection to the buyer. The grantor guarantees clear title and the right to sell the property.',
    useCaseHint: 'Best for property sales where the buyer wants maximum protection.',
    baseFee: 399,
    estimatedRecordingFee: 35,
  },
  {
    id: 'quitclaim-deed',
    name: 'Quitclaim Deed',
    slug: 'quitclaim-deed',
    description:
      'Transfers whatever interest the grantor has in the property without any warranties about the title.',
    useCaseHint:
      'Common for transfers between family members, to trusts, or divorce situations.',
    baseFee: 349,
    estimatedRecordingFee: 35,
  },
  {
    id: 'special-warranty-deed',
    name: 'Special Warranty Deed',
    slug: 'special-warranty-deed',
    description:
      'The grantor warrants only against title defects that occurred during their period of ownership.',
    useCaseHint: 'Often used in commercial transactions or corporate transfers.',
    baseFee: 399,
    estimatedRecordingFee: 35,
  },
  {
    id: 'ladybird-deed',
    name: 'Lady Bird Deed',
    slug: 'ladybird-deed',
    description:
      'An enhanced life estate deed that allows the property to pass to beneficiaries at death while retaining full control during life.',
    useCaseHint:
      'Popular for estate planning \u2014 avoids probate while retaining control.',
    baseFee: 449,
    estimatedRecordingFee: 35,
  },
  {
    id: 'life-estate-deed',
    name: 'Life Estate Deed',
    slug: 'life-estate-deed',
    description:
      'Grants a life interest in the property to one party, with the property passing to a designated remainderman upon death.',
    useCaseHint:
      'Used in estate planning when you want to designate future ownership.',
    baseFee: 399,
    estimatedRecordingFee: 35,
  },
];

export function getDocumentTypeBySlug(slug: string) {
  return documentTypes.find((dt) => dt.slug === slug);
}
