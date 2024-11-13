import { DialogContent } from '@mui/material';
import React from 'react';
import { MajorKeysEditor } from './MajorKeysEditor';
import { TagsEditor } from './TagsEditor/TagsEditor';
import { EditDialogActions } from './EditDialogActions';
import { OptionsEditor } from './OptionsEditor';
import { CommentField } from './CommentField';
import { OsmUserLogged } from './OsmUserLogged';
import { ContributionInfoBox } from './ContributionInfoBox';
import { OsmUserLoggedOut } from './OsmUserLoggedOut';
import { PresetSelect } from './PresetSelect';
import { FieldsEditor } from './FieldsEditor';

export const EditContent = () => (
  <>
    <DialogContent dividers>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <OsmUserLoggedOut />
        <PresetSelect />
        <FieldsEditor />
        {/*<MajorKeysEditor />*/}
        <OptionsEditor />
        <ContributionInfoBox />
        <CommentField />
        <TagsEditor />
        <OsmUserLogged />
      </form>
    </DialogContent>
    <EditDialogActions />
  </>
);
