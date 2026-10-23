// ==============================================================================
// تعريف أنواع قاعدة البيانات - نظام بيت التمكين للتسويق (غزارة + معين)
// TypeScript Database Entity Interfaces & RBAC Contracts
// ==============================================================================

export type ContractEntityCode = 'BAYT_TAMKEEN' | 'GHAZARA' | 'MOEEN';

export interface ContractEntity {
  id: string;
  code: ContractEntityCode;
  name_ar: string;
  name_en: string;
  cr_number: string;
  tax_number?: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  logo_url?: string;
  is_active: boolean;
  settings: {
    primary_color: string;
    accent_color: string;
    default_commission_rate: number;
    auto_archive_days: number;
  };
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'sales_manager' | 'marketer' | 'accountant';

export interface UserPermissions {
  can_view_all_requests: boolean;
  can_create_request: boolean;
  can_approve_request: boolean;
  can_upload_bond: boolean;
  can_verify_bond: boolean;
  can_manage_associations: boolean;
  can_manage_licenses: boolean;
  can_calculate_commissions: boolean;
  can_approve_payroll: boolean;
  can_view_operation_logs: boolean;
  can_export_reports: boolean;
}

export interface User {
  id: string;
  entity_id: string;
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  role: UserRole;
  permissions: UserPermissions;
  base_salary: number;
  commission_rate: number;
  monthly_target: number;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type AssociationStatus = 'active' | 'inactive' | 'under_review';

export interface Association {
  id: string;
  entity_id: string;
  name: string;
  short_name?: string;
  code: string;
  license_number: string;
  category: string;
  city: string;
  address?: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  contract_start_date: string;
  contract_end_date?: string;
  agreement_commission_rate: number;
  bank_name?: string;
  bank_iban?: string;
  status: AssociationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type LicenseType = 
  | 'establishment_license' 
  | 'fundraising_campaign' 
  | 'commercial_marketing' 
  | 'collection_box' 
  | 'bank_account_license';

export type LicenseAlertStatus = 'valid' | 'expiring_soon' | 'expired' | 'renewed';

export interface License {
  id: string;
  association_id: string;
  entity_id: string;
  license_type: LicenseType;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  alert_status: LicenseAlertStatus;
  attachment_url?: string;
  attachment_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type RequestStatus = 'in_progress' | 'awaiting_supervisor' | 'completed' | 'closed';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RequestCategory = 
  | 'donation_bonds' 
  | 'marketing_campaign' 
  | 'field_collection' 
  | 'license_renewal' 
  | 'urgent_aid_support';

export interface SalesRequest {
  id: string;
  reference_number: string; // REQ-2026-XXXX
  request_date: string;
  entity_id: string;
  association_id: string;
  marketer_id: string;
  supervisor_id?: string;
  title: string;
  category: RequestCategory;
  status: RequestStatus;
  priority: RequestPriority;
  reminder_number: number;
  last_reminder_at?: string;
  target_amount: number;
  total_bonds_amount: number;
  bonds_count: number;
  notes?: string;
  completed_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export type BondDonorType = 'individual' | 'corporate' | 'anonymous';
export type BondPaymentMethod = 
  | 'bank_transfer' 
  | 'mada' 
  | 'apple_pay' 
  | 'visa' 
  | 'mastercard' 
  | 'stc_pay' 
  | 'cash' 
  | 'pos_terminal';

export type BondVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface DonationBond {
  id: string;
  bond_number: string; // BND-2026-XXXX
  request_id: string;
  association_id: string;
  marketer_id: string;
  entity_id: string;
  amount: number;
  donor_name: string;
  donor_phone?: string;
  donor_type: BondDonorType;
  payment_method: BondPaymentMethod;
  payment_reference?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  upload_date: string;
  verification_status: BondVerificationStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type CommissionStatus = 'draft' | 'reviewed' | 'approved' | 'paid';

export interface CommissionRecord {
  id: string;
  period_month: number;
  period_year: number;
  marketer_id: string;
  entity_id: string;
  completed_requests_count: number;
  total_verified_donations: number;
  monthly_target: number;
  achievement_rate: number;
  base_salary: number;
  commission_rate: number;
  commission_amount: number;
  tier_bonus: number;
  deductions: number;
  net_payable: number;
  status: CommissionStatus;
  reviewed_by?: string;
  approved_by?: string;
  paid_at?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type OperationAction = 
  | 'LOGIN'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'VERIFY_BOND'
  | 'REJECT_BOND'
  | 'REMINDER_SENT'
  | 'COMMISSION_CALC'
  | 'PAYROLL_APPROVED'
  | 'PAYROLL_PAID'
  | 'FILE_UPLOAD'
  | 'DATA_EXPORT';

export interface OperationLog {
  id: string;
  entity_id: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  action: OperationAction;
  affected_entity: 'requests' | 'donation_bonds' | 'associations' | 'licenses' | 'users' | 'commissions' | 'contract_entities';
  affected_record_id?: string;
  description: string;
  payload_diff?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
