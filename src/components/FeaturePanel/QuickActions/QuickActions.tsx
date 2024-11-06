import styled from '@emotion/styled';
import DirectionsIcon from '@mui/icons-material/Directions';
import { QuickActionButton } from './QuickActionButton';
import { StarButton } from './StarButton';
import Router from 'next/router';
import { ShareButton } from './ShareDialog/ShareButton';
import { t } from '../../../services/intl';

const Wrapper = styled.div`
  max-width: 100%;
  width: fit-content;
  margin-top: 0.75rem;

  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Used to overwrite pointer-events: none from the collapsed featurepanel drawer */
  pointer-events: all;
`;

const Container = styled.div`
  width: max-content;
  display: flex;
  gap: 6px;
`;

export const QuickActions = () => (
  <>
    <Wrapper>
      <Container>
        <QuickActionButton
          icon={DirectionsIcon}
          label={t('featurepanel.directions_button')}
          onClick={() => {
            Router.push('/directions');
          }}
        />
        <ShareButton />
        <StarButton />
      </Container>
    </Wrapper>
  </>
);
