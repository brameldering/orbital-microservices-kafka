import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title: string;
  description?: string;
  keywords?: string;
}

const Meta: React.FunctionComponent<MetaProps> = ({
  title,
  description,
  keywords,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Orbital Shop',
  description: 'We sell the best products',
  keywords: 'electronics, buy electronics',
};

export default Meta;
