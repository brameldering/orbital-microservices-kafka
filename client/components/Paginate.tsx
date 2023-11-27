import React from 'react';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';
import { PRODUCTS_PAGE } from 'constants/client-pages';

interface PaginateProps {
  pages: number;
  page: number;
  keyword?: string;
  isAdmin?: boolean;
}

const Paginate: React.FunctionComponent<PaginateProps> = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
}) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            href={
              !isAdmin
                ? keyword
                  ? `${PRODUCTS_PAGE}?keyword=${keyword.trim()}&page/${x + 1}`
                  : `${PRODUCTS_PAGE}?page=${x + 1}`
                : `/admin/productlist/?page=${x + 1}`
            }>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </Link>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
