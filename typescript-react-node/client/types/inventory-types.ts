export interface IInventoryProduct {
  productId: string;
  name: string;
  brand: string;
  category: string;
}

export interface IInventory extends IInventoryProduct {
  quantity: number;
}

export interface ISerialNumber {
  productId: string;
  serialNumber: string;
  status: string;
}

export enum SerialStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  BROKEN = 'BROKEN',
  UNDER_REPAIR = 'UNDER_REPAIR',
  RETURNED_TO_VENDOR = 'RETURNED_TO_VENDOR',
}
