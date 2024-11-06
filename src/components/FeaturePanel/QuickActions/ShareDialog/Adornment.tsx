import React from 'react';
import styled from '@emotion/styled';
import { InputAdornment, Button, Tooltip, IconButton } from '@mui/material';
import { ShareIcon, supportsSharing } from './helpers';
import ContentCopy from '@mui/icons-material/ContentCopy';

const StyledButton = styled(Button)`
  color: inherit;
  padding: 0 8px;
`;

export const Adornment = ({
  payload,
  type,
}: {
  payload: string;
  type: 'url' | 'text';
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <InputAdornment position="end">
      <StyledButton
        startIcon={<ContentCopy fontSize="small" />}
        onClick={async () => {
          await navigator.clipboard.writeText(payload);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2_000);
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </StyledButton>
      {supportsSharing() && (
        <Tooltip title="Share">
          <IconButton
            onClick={() => {
              navigator
                .share({
                  title: 'OsmAPP',
                  [type]: payload,
                })
                .catch(() => {});
            }}
            size="small"
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </InputAdornment>
  );
};
