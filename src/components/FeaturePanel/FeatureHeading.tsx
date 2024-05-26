import React from 'react';
import styled from 'styled-components';
import { EditIconButton } from './helpers/EditIconButton';
import { useEditDialogContext } from './helpers/EditDialogContext';

const Wrapper = styled.div`
  font-size: 30px;
  line-height: 0.98;
  position: relative;
  padding-bottom: 30px;
  ${({ deleted }) => deleted && 'text-decoration: line-through;'}

  padding: 25px 20px;
  &:hover .show-on-hover {
    display: block !important;
  }
`;

export const FeatureHeading = ({ title, deleted, editEnabled }) => {
  const { openWithTag } = useEditDialogContext();

  return (
    <Wrapper deleted={deleted}>
      {editEnabled && <EditIconButton onClick={() => openWithTag('name')} />}
      {title}
    </Wrapper>
  );
};
