import React, { useState } from 'react';
import { LineInformation, requestLines } from './requestRoutes';
import { PublicTransportCategory } from './PublicTransportWrapper';
import { DotLoader } from '../../../helpers';
import { sortByReference } from './helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import groupBy from 'lodash/groupBy';
import { useQuery } from 'react-query';
import { Typography } from '@mui/material';
import { useShowOnMap } from './useShowOnMap';

const categories = [
  'tourism',
  'subway',
  'commuter',
  'regional',
  'long_distance',
  'high_speed',
  'night',
  'car',
  'car_shuttle',
  'bus',
  'unknown',
];

type PublicTransportDisplayProps = {
  routes: LineInformation[];
  geoJson: GeoJSON.FeatureCollection;
};

const PublicTransportDisplay = ({
  routes,
  geoJson,
}: PublicTransportDisplayProps) => {
  const [shownCategories, setShownCategories] = useState([
    'subway',
    'commuter',
    'regional',
    'bus',
  ]);

  const grouped = groupBy(routes, ({ service }) => {
    const base = service?.split(';')[0];
    return categories.includes(base) ? base : 'unknown';
  });
  const entries = Object.entries(grouped) as [string, LineInformation[]][];
  const sorted = sortByReference(entries, categories, ([category]) => category);

  useShowOnMap(geoJson, shownCategories);

  return (
    <>
      {sorted.map(([category, lines]) => (
        <PublicTransportCategory
          key={category}
          category={category}
          lines={lines}
          showHeading={sorted.length > 1}
          shownCategories={shownCategories}
          onChange={(categories) => {
            setShownCategories(categories);
          }}
        />
      ))}
    </>
  );
};

export const PublicTransportInner = () => {
  const { feature } = useFeatureContext();
  const { id, type } = feature.osmMeta;

  const { data, status } = useQuery([id, type], () =>
    requestLines(type, Number(id)),
  );

  return (
    <div>
      {(status === 'loading' || status === 'idle') && <DotLoader />}
      {status === 'success' && (
        <PublicTransportDisplay routes={data.routes} geoJson={data.geoJson} />
      )}
      {status === 'error' && (
        <Typography color="secondary" paragraph>
          Error
        </Typography>
      )}
    </div>
  );
};
