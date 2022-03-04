import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './paginationFeed.css'

export default function PaginationControlled({count, parentCallBack}) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    onTrigger(value)
  };

  const onTrigger = (page) => {
      parentCallBack(page);

  }

  return (
      <Pagination className='pagination' count={Math.ceil(count/5)} page={page} onChange={handleChange} />
  );
}
