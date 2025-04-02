export interface IRole {
  id: string;
  role: string;
  roleDisplay: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IRoleCreate {
  role: string;
  roleDisplay: string;
}
