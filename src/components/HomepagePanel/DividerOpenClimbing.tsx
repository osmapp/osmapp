import React from 'react';

type DivoderOpenClimbingProps = {
  width: number | string;
  style?: React.CSSProperties;
};

export const DividerOpenClimbing = ({
  width,
  style,
}: DivoderOpenClimbingProps) => (
  <svg
    width={width}
    viewBox="0 0 1776 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M8 30.4758L770.042 30.4758C868.384 30.4758 865.376 72.947 899.308 72.947C928.393 72.947 937.28 53.7187 937.28 40.0921C937.28 26.4654 930.009 7.99993 899.308 7.99992C860.528 7.99992 873.455 72.947 834.675 72.947C803.974 72.947 797.511 53.7187 797.511 40.0921C797.511 26.4654 807.206 7.99992 834.675 7.99992C868.607 7.99992 868.384 49.7079 968.789 49.7083L1768 49.7084"
      stroke="#EB5757"
      strokeWidth="12"
      strokeLinecap="round"
    />
  </svg>
);
