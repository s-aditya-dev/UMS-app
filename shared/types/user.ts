export interface userType {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
  settings?: {
    isRegistered?: boolean;
    isPassChange: boolean;
  };
}
