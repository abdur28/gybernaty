export type AccessLevel = 'personal' | 'A' | 'B' | 'C' | 'D';

export interface User {
  id: string;
  address: string;
  username: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
}

