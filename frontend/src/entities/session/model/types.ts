export type Role = 'guest' | 'buyer' | 'seller' | 'admin';

export interface Viewer {
  role: Role;
  balance?: number;           
  organizationName?: string;  
}