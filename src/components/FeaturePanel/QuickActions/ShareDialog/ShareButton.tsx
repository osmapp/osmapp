import { QuickActionButton } from '../QuickActionButton';
import { ShareIcon } from './helpers';
import React from 'react';
import { useBoolState } from '../../../helpers';
import { t } from '../../../../services/intl';
import { ShareDialog } from './ShareDialog';

export const ShareButton = () => {
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <QuickActionButton
        label={t('featurepanel.share_button')}
        icon={ShareIcon}
        onClick={open}
      />
      <ShareDialog open={opened} onClose={close} />
    </>
  );
};
