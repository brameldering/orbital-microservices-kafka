import { inventoryDB } from '../src/server';

type ExistsResult = { exists: boolean }[];

export const postgresTableExists = async (
  schema: string,
  tableName: string
) => {
  const result: ExistsResult = await inventoryDB.$queryRaw`SELECT EXISTS (
  SELECT FROM
      pg_catalog.pg_class c
  JOIN
      pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE
      n.nspname = ${schema} AND
      c.relname = ${tableName} AND
      c.relkind = 'r'
);`;
  return result[0].exists;
};
