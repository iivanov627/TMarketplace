export type Role = 'guest' | 'buyer' | 'seller' | 'admin';

export interface Viewer {
  id?: string;
  login?: string;
  role: Role;
  balance?: number;
  organizationName?: string;
}