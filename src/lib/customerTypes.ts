export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  cap?: string;
  notes?: string;
  createdAt: string;
  lastLoginAt?: string;
}
