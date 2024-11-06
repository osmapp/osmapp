import React from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useEditDialogFeature } from '../utils';
import { useEditContext } from '../EditContext';
import { DialogHeading } from '../components';
import { t, Translation } from '../../../../services/intl';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { useToggleState } from '../../../helpers';
import { getIdEditorLink } from '../../helpers/externalLinks';

export const PlaceCancelledToggle = () => {
  const {
    tags: { cancelled, toggleCancelled },
  } = useEditContext();
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={cancelled} onChange={toggleCancelled} />}
        label={t('editdialog.place_cancelled')}
      />
      <br />
    </>
  );
};

export const ChangeLocationEditor = () => {
  const { feature } = useEditDialogFeature();
  const { location, setLocation } = useEditContext();

  const { loggedIn } = useOsmAuthContext();
  const [showLocation, toggleShowLocation] = useToggleState(false);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox checked={showLocation} onChange={toggleShowLocation} />
        }
        label={t('editdialog.location_checkbox')}
      />
      {showLocation && !loggedIn && (
        <div style={{ marginLeft: 30 }}>
          <TextField
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('editdialog.location_placeholder')}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            fullWidth
            rows={2}
            variant="outlined"
          />
        </div>
      )}
      {showLocation && loggedIn && (
        <div style={{ marginLeft: 30 }}>
          <Translation
            id="editdialog.location_editor_to_be_added"
            values={{ link: getIdEditorLink(feature) }}
          />
        </div>
      )}
    </>
  );
};

export const OptionsEditor = () => {
  const { isAddPlace, isUndelete } = useEditDialogFeature();

  return (
    <>
      {!isAddPlace && !isUndelete && (
        <>
          <DialogHeading>{t('editdialog.options_heading')}</DialogHeading>
          <PlaceCancelledToggle />
          <ChangeLocationEditor />
        </>
      )}
    </>
  );
};
