import React, { useEffect } from 'react';
import { ICurrentUser } from '@orbitelco/common';
import { NextPageContext } from 'next';
import { getCurrentUser } from '../api/get-current-user';
import { useUserContext } from 'context/user-context';

interface TPageProps {
  currentUser?: ICurrentUser;
}

const LandingPage: React.FC<TPageProps> = ({ currentUser }) => {
  const { setUserContext } = useUserContext();
  useEffect(() => {
    const setUserContextEffect = () => {
      if (currentUser) {
        setUserContext({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        });
      }
    };
    setUserContextEffect();
  }, [currentUser, setUserContext]);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  return { props: data };
};

export default LandingPage;
