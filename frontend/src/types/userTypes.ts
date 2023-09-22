export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRegistration {
  name: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IPasswordUpdate {
  _id: string;
  currentPassword: string;
  newPassword: string;
}

export interface IPasswordReset {
  email: string;
}
