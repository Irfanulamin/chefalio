export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type KycType = 'passport' | 'nid' | 'driving_license';

export interface ChefApplication {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        fullName: string;
        username: string;
        email: string;
        profile_url: string;
      };
  status: ApplicationStatus;
  fullName: string;
  bio: string;
  specialty: string;
  yearsOfExperience: number;
  kycType: KycType;
  kycDocumentUrl: string;
  referenceUrl: string;
  youtubeUrl?: string;
  achievements: string[];
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  rejectionNote?: string;
  reviewedBy?: string | { _id: string; fullName: string; username: string };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChefApplicationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface SubmitChefApplicationPayload {
  fullName: string;
  bio: string;
  specialty: string;
  yearsOfExperience: number;
  kycType: KycType;
  kycDocument: File;
  referenceUrl: string;
  youtubeUrl?: string;
  achievements: string[];
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}
