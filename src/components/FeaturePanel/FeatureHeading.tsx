import React from 'react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, useMediaQuery } from '@mui/material';
import { useEditDialogContext } from './helpers/EditDialogContext';
import { PoiDescription } from './helpers/PoiDescription';
import { getLabel, getSecondaryLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { isMobileDevice } from '../helpers';
import { QuickActions } from './QuickActions/QuickActions';

const StyledEditButton = styled(IconButton)`
  visibility: hidden;
  position: relative;
  top: 3px;
`;
const NameWithEdit = styled.div`
  display: flex;
  gap: 8px;
`;

const EditNameButton = () => {
  const { openWithTag } = useEditDialogContext();
  const { feature } = useFeatureContext();
  if (feature?.skeleton || isMobileDevice()) {
    return null;
  }

  return (
    <div>
      <StyledEditButton onClick={() => openWithTag('name')} size="small">
        <EditIcon
          fontSize="small"
          titleAccess={t('featurepanel.inline_edit_title')}
        />
      </StyledEditButton>
    </div>
  );
};

const Container = styled.div<{ isStandalone: boolean }>`
  margin: 12px 0 20px 0;
  ${({ isStandalone }) => isStandalone && 'padding-bottom: 8px;'}
`;

const HeadingContainer = styled.div`
  margin: 6px 0 4px 0;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  &:hover ${StyledEditButton} {
    visibility: visible;
  }
`;

const HeadingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Headings = () => {
  const { feature } = useFeatureContext();
  const label = getLabel(feature);
  const secondaryLabel = getSecondaryLabel(feature);
  return (
    <HeadingsWrapper>
      <Heading $deleted={feature?.deleted}>{label}</Heading>
      {secondaryLabel && (
        <SecondaryHeading $deleted={feature?.deleted}>
          {secondaryLabel}
        </SecondaryHeading>
      )}
    </HeadingsWrapper>
  );
};

const Heading = styled.h1<{ $deleted: boolean }>`
  font-size: 36px;
  line-height: 0.98;
  margin: 0;
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;
const SecondaryHeading = styled.h2<{ $deleted: boolean }>`
  font-size: 24px;
  line-height: 0.98;
  margin: 0;
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

export const FeatureHeading = React.forwardRef<HTMLDivElement>((_, ref) => {
  // thw pwa needs space at the bottom
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  return (
    <Container ref={ref} isStandalone={isStandalone}>
      <PoiDescription />
      <HeadingContainer>
        <NameWithEdit>
          <Headings />
          {/* <YellowedBadge /> */}
          <EditNameButton />
        </NameWithEdit>
      </HeadingContainer>
      <QuickActions />
    </Container>
  );
});
FeatureHeading.displayName = 'FeatureHeading';
