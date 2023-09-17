import React from 'react';
const LogoSVG = () => {
  return (
    <svg
      width='50'
      height='50'
      viewBox='0 0 240 240'
      fill='none'
      stroke='#6aa0cb'
      strokeWidth='10'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='120' cy='120' r='48' strokeWidth='0' fill='#6aa0cb'></circle>
      <path d='M 120 50 A 70 70 0 1 0 177 80'></path>
      <path d='M 152.9 58.2 A 70 70 0 0 0 120 50'></path>
      <path d='M 218.5 102.6 A 100 100 0 0 0 21.5 137.4'></path>
      <path d='M 32 170 A 100 100 0 0 0 218.5 137.4'></path>
    </svg>
  );
};

export default LogoSVG;
