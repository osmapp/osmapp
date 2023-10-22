import { getUrlForTag } from './getUrlForTag';
import { slashToOptionalBr } from '../../helpers';
import React from 'react';

export const renderValue = (k, v) => {
  const url = getUrlForTag(k, v);
  let humanValue = v.replace(/^https?:\/\//, '').replace(/^([^/]+)\/$/, '$1');

  if (k === 'image') {
    humanValue = humanValue.replace(/^([^/]+.{0,5})(.*)$/, (full, p1, p2) => {
      const charsLeft = 30 - p1.length;
      return (
        p1 + (full.length > 40 ? `…${p2.substring(p2.length - charsLeft)}` : p2)
      );
    });
  }

  if (k.match(/:?wikipedia$/) && v.match(/:/)) {
    humanValue = v.split(':', 2)[1];
  }

  return url ? <a href={url}>{slashToOptionalBr(humanValue)}</a> : v;
};
