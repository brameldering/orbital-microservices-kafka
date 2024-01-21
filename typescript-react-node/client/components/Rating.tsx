import React from 'react';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';

interface RatingProps {
  value: number;
  text?: string;
}

const CustomRating: React.FC<RatingProps> = ({ value, text }) => {
  return (
    <div>
      <Rating
        name='customized-rating'
        value={value}
        precision={0.5}
        readOnly
        icon={<StarIcon fontSize='inherit' />}
        emptyIcon={<StarBorderIcon fontSize='inherit' />}
      />
      {text && (
        <Typography component='span' variant='body2' color='text.secondary'>
          {text}
        </Typography>
      )}
    </div>
  );
};

export default CustomRating;
