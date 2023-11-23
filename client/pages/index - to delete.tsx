import React from 'react';
import { useSelector } from 'react-redux';
// import { ICurrentUser } from '@orbitelco/common';
// import { NextPageContext } from 'next';
// import { getCurrentUser } from '../api/get-current-user';
import type { RootState } from '../slices/store';

// interface TPageProps {
//   currentUser?: ICurrentUser;
// }

const LandingPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return userInfo ? (
    <h1>You are signed in {userInfo.name}</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// export const getServerSideProps = async (context: NextPageContext) => {
//   const { data } = await getCurrentUser(context);
//   return { props: data };
// };

export default LandingPage;
