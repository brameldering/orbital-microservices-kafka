import React from 'react';
import { NextPageContext } from 'next';
import Meta from 'components/Meta';
import { getCurrentUser } from 'api/get-current-user';

interface TLandingPageProps {
  currentUser?: { name: string; email: string };
}

const LandingPage: React.FC<TLandingPageProps> = ({ currentUser }) => {
  return currentUser ? (
    <>
      <Meta title='Home' />
      <h1>
        You are signed in as {currentUser.email}, {currentUser.name}
      </h1>
    </>
  ) : (
    <>
      <Meta title='Home' />
      <h1>You are not signed in</h1>
    </>
  );
};

// getInitialProps is executed on the server before the LandingPage component is send back.
// However when navigating from one page to another while in the app then getInitialProps is executed on the client
export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  return { props: data };
};

// export const getStaticProps = async (context: NextPageContext) => {
// };

export default LandingPage;
