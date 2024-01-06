import { Prisma } from '@prisma/client';
// import { inventoryDB } from '../src/server';

export const invProducts = [
  {
    product_id: 'PRD-0000000001',
    name: 'Airpods Wireless Bluetooth Headphones',
    brand: 'Apple',
    category: 'Electronics',
    quantity: {
      create: { quantity: 100 },
    },
  },
  {
    product_id: 'PRD-0000000002',
    name: 'iPhone 13 Pro 256GB Memory',
    brand: 'Apple',
    category: 'Electronics',
    quantity: {
      create: { quantity: 12 },
    },
  },
  {
    product_id: 'PRD-0000000003',
    name: 'Cannon EOS 80D DSLR Camera',
    brand: 'Cannon',
    category: 'Electronics',
    quantity: {
      create: { quantity: 3 },
    },
  },
  {
    product_id: 'PRD-0000000004',
    name: 'Sony Playstation 5',
    brand: 'Sony',
    category: 'Electronics',
    quantity: {
      create: { quantity: 2 },
    },
    serial_numbers: {
      create: [
        { serial_number: 'PS12345', status: 'AVAILABLE' },
        { serial_number: 'PS12346', status: 'SOLD' },
      ],
    },
  },
  {
    product_id: 'PRD-0000000005',
    name: 'Logitech G-Series Gaming Mouse',
    brand: 'Logitech',
    category: 'Electronics',
    quantity: {
      create: { quantity: 1 },
    },
    serial_numbers: {
      create: [{ serial_number: 'GM12345', status: 'AVAILABLE' }],
    },
  },
  {
    product_id: 'PRD-0000000006',
    name: 'Amazon Echo Dot 3rd Generation',
    brand: 'Amazon',
    category: 'Electronics',
    quantity: {
      create: { quantity: 0 },
    },
  },
] satisfies Prisma.productCreateInput[];
