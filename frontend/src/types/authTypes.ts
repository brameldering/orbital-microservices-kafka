export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserInfo {
  userInfo: User | null;
}
