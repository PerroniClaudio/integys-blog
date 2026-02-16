export interface Service {
  id: number;
  title: string;
  slug: string;
  short: string;
  section_text: string;
  description: string[];
  imageUrl: string;
}

export interface UserLight {
  id: string;
  email: string;
  is_admin:  boolean;
  is_deleted:  boolean;
  is_new:  boolean;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: string;
  name?: string;
  surname?: string;
  phone?: string;
  occupation?: string;
  company?: string;
  company_address?: string;
}
