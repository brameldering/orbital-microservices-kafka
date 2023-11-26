import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { INDEX_PAGE } from 'constants/client-pages';

const SearchBox = () => {
  const router = useRouter();
  const { keyword: urlKeyword } = router.query;
  const [keyword, setKeyword] = useState(urlKeyword?.toString() || '');

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      router.push(INDEX_PAGE);
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        id='search_keyword'
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'></Form.Control>
      <Button
        id='LINK_header_search'
        type='submit'
        variant='outline-light'
        className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
