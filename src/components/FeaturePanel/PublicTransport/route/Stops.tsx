import Link from 'next/link';
import { Feature } from '../../../../services/types';
import { StationItem, StationsList } from './helpers';
import { Button, Typography } from '@mui/material';
import { t } from '../../../../services/intl';
import { getUrlOsmId } from '../../../../services/helpers';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ChevronRight';

type ShowMoreLessButtonProps = {
  type: 'collapse' | 'expand';
  stopCount: number;
  onClick?: (e: unknown) => void;
};

const ShowMoreLessButton = ({
  type,
  onClick,
  stopCount,
}: ShowMoreLessButtonProps) => (
  <Typography color="textSecondary">
    <Button
      color="inherit"
      aria-label={type}
      onClick={onClick}
      endIcon={type === 'collapse' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    >
      {t(
        type === 'collapse'
          ? 'publictransport.visible_stops'
          : 'publictransport.hidden_stops',
        { amount: stopCount - 2 },
      )}
    </Button>
  </Typography>
);

type Props = {
  stops: Feature[];
  stopCount: number;
  onExpand: () => void;
  onCollapse: () => void;
};

export const Stops = ({ stops, stopCount, onExpand, onCollapse }: Props) => {
  const hasFullLength = stops.length === stopCount;
  return (
    <StationsList>
      {stops.map((stop, i) => (
        <>
          <StationItem isFirst={i === 0} isLast={i === stops.length - 1}>
            <Link href={getUrlOsmId(stop.osmMeta)}>{stop.tags.name}</Link>
          </StationItem>
          {i === 0 && (
            <StationItem showCircle={false}>
              <ShowMoreLessButton
                type={hasFullLength ? 'collapse' : 'expand'}
                stopCount={stopCount}
                onClick={hasFullLength ? onCollapse : onExpand}
              />
            </StationItem>
          )}
        </>
      ))}
    </StationsList>
  );
};
