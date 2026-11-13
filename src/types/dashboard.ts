export type RequestStatus = 'in_progress' | 'awaiting_supervisor' | 'completed' | 'closed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface DashboardRequestRecord {
  referenceNumber: string;
  associationName: string;
  title: string;
  requestDate: string;
  amount: number;
  status: RequestStatus;
}

export interface DashboardDonationRecord {
  bondNumber: string;
  donorName: string;
  campaignName: string;
  uploadDate: string;
  donationAmount: number;
  verificationStatus: VerificationStatus;
}
