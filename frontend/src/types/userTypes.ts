export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRes {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface UserUpdateReq {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserUpdateRes {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface RegistrationReq {
  name: string;
  email: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface ProfileUpdateReq {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileUpdateRes {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface PasswordUpdateReq {
  _id: string;
  email?: string;
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetReq {
  email: string;
}
