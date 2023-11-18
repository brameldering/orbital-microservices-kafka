import { NextPageContext } from 'next';
import buildClient from './build-client';
import { CURRENT_USER_URL } from '@orbitelco/common';

export const getCurrentUser = async (context: NextPageContext) => {
  console.log('getCurrentUser.getServerSideProps');
  const client = buildClient(context);
  const data = await client.get(CURRENT_USER_URL);
  return data;
};
