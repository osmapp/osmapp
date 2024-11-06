import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import React from 'react';
import { t } from '../../../services/intl';
import { useStarsContext } from '../../utils/StarsContext';
import { useIsClient } from '../../helpers';
import { QuickActionButton } from './QuickActionButton';
import { useFeatureContext } from '../../utils/FeatureContext';

const StarButtonPure = ({ isStarred, toggleStar }) => (
  <QuickActionButton
    onClick={toggleStar}
    label={
      isStarred
        ? t('featurepanel.favorites_unsave_button')
        : t('featurepanel.favorites_save_button')
    }
    icon={isStarred ? Star : StarBorder}
  />
);

export const StarButton = () => {
  const { feature } = useFeatureContext();
  const { toggleStar, isStarred } = useStarsContext();
  const isClient = useIsClient(); // SSR doesn't know localStorage, so it would end with hydrationWarning

  if (feature.point) {
    return null;
  }

  return (
    <>
      {isClient ? (
        <StarButtonPure isStarred={isStarred} toggleStar={toggleStar} />
      ) : (
        <StarButtonPure isStarred={false} toggleStar={() => {}} />
      )}
    </>
  );
};
