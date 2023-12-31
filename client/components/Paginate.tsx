import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
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
      <Pagination
        page={page}
        count={pages}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={
              !isAdmin
                ? keyword
                  ? `${PRODUCTS_PAGE}?keyword=${keyword.trim()}&page/${
                      item.page
                    }`
                  : `${PRODUCTS_PAGE}?page=${item.page}`
                : `/admin/productlist/?page=${item.page}`
            }
            {...item}
          />
        )}
      />
    )
  );
};

export default Paginate;
