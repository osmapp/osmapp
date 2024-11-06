import React from 'react';
import { getFullOsmappLink, getShortLink } from '../../../../services/helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import styled from '@emotion/styled';
import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { Adornment } from './Adornment';
import { t } from '../../../../services/intl';

const useLink = (short: boolean) => {
  const { feature } = useFeatureContext();
  const [link, setLink] = React.useState(
    short ? getShortLink(feature) : getFullOsmappLink(feature),
  );

  React.useEffect(() => {
    const url = short ? getShortLink(feature) : getFullOsmappLink(feature);
    setLink(url);
  }, [short, feature]);
  return link;
};

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    height: 3.5rem;
    background-color: ${(props) => props.theme.palette.action.hover};
    font-family: monospace;
    &:hover {
      background-color: ${(props) => props.theme.palette.action.selected};
    }
  }
`;

export const LinkSection = () => {
  const { feature } = useFeatureContext();
  const supportsShortUrl = !feature.point;
  const [short, setShort] = React.useState(supportsShortUrl);
  const link = useLink(short);

  return (
    <section>
      <h3>{t('sharedialog.link')}</h3>
      <Stack spacing={1}>
        <StyledTextField
          fullWidth
          value={link}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              endAdornment: <Adornment payload={link} type="url" />,
            },
          }}
        />
        {supportsShortUrl && (
          <FormControlLabel
            control={
              <Checkbox
                checked={short}
                onChange={({ target }) => {
                  setShort(target.checked);
                }}
              />
            }
            label="Shortened Link"
          />
        )}
      </Stack>
    </section>
  );
};
