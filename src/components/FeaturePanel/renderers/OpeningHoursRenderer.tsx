import React from 'react';
import styled from '@emotion/styled';
import AccessTime from '@mui/icons-material/AccessTime';
import { useToggleState } from '../../helpers';
import { t } from '../../../services/intl';
import { ToggleButton } from '../helpers/ToggleButton';
import { parseOpeningHours } from './openingHours';
import { SimpleOpeningHoursTable } from './openingHours/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { Status } from './openingHours/complex';

const Table = styled.table`
  margin: 1em;

  th {
    width: 100px;
    text-align: left;
    font-weight: normal;
    vertical-align: baseline;
  }
`;

// const weekDays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
const weekDays = t('opening_hours.days_su_mo_tu_we_th_fr_sa').split('|');

const formatTimes = (times: string[]) =>
  times.length ? times.map((x) => x.replace(/:00/g, '')).join(', ') : '-';

const formatDescription = (status: Status, days: SimpleOpeningHoursTable) => {
  const timesByDay = Object.values(days);
  const day = new Date().getDay();
  const today = timesByDay[day];
  const todayTime = formatTimes(today);
  const isOpenedToday = today.length;

  switch (status) {
    case 'opened':
      return t('opening_hours.open', { todayTime });
    case 'closed':
      return isOpenedToday
        ? t('opening_hours.now_closed_but_today', { todayTime })
        : t('opening_hours.today_closed');
    case 'opens-soon':
      return isOpenedToday
        ? t('opening_hours.opens_soon_today', { todayTime })
        : t('opening_hours.opens_soon');
    case 'closes-soon':
      return t('opening_hours.closes_soon');
  }
};

const OpeningHoursRenderer = ({ v }) => {
  const [isExpanded, toggle] = useToggleState(false);

  const { countryCode, center } = useFeatureContext().feature;

  const openingHours = parseOpeningHours(v, center, {
    country_code: countryCode,
    state: '',
  });
  if (!openingHours) return null;

  const { daysTable, status, maybeReasons } = openingHours;

  const { ph, ...days } = daysTable;
  const timesByDay = Object.values(days).map((times, idx) => ({
    times,
    day: weekDays[idx],
  }));

  const currentDay = new Date().getDay();
  const daysStartingToday = [
    ...timesByDay.slice(currentDay),
    ...timesByDay.slice(0, currentDay),
  ];

  return (
    <>
      <AccessTime fontSize="small" />
      <div suppressHydrationWarning>
        {formatDescription(status, daysTable)}
        {maybeReasons.length > 0 && (
          <>
            <br />
            Maybe: {maybeReasons.join(' or ')}
          </>
        )}
        <ToggleButton onClick={toggle} isShown={isExpanded} />
        {isExpanded && (
          <Table>
            <tbody>
              {daysStartingToday.map(({ day, times }) => (
                <tr key={day}>
                  <th>{day}</th>
                  <td>{formatTimes(times)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default OpeningHoursRenderer;
