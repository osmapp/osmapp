import { useEffect, useMemo, useState } from 'react';
import {
  getInstantImage,
  ImageType,
} from '../../../services/images/getImageDefs';
import { not, publishDbgObject } from '../../../utils';
import { getImageFromApi } from '../../../services/images/getImageFromApi';
import { useFeatureContext } from '../../utils/FeatureContext';
import { ImageDef, isInstant } from '../../../services/types';

export type ImageGroup = { def: ImageDef; images: ImageType[] };

const getInitialState = (defs: ImageDef[]): ImageGroup[] =>
  defs?.filter(isInstant)?.map((def) => ({
    def,
    images: getInstantImage(def) ? [getInstantImage(def)] : [],
  })) ?? [];

export const useLoadImages = () => {
  const { feature } = useFeatureContext();
  const defs = feature?.imageDefs;
  const apiDefs = useMemo(() => defs?.filter(not(isInstant)) ?? [], [defs]);

  const initialState = useMemo(() => getInitialState(defs), [defs]);
  const [loading, setLoading] = useState(apiDefs.length > 0);
  const [groups, setGroups] = useState<ImageGroup[]>(initialState);

  useEffect(() => {
    setGroups(initialState);
    const promises = apiDefs.map(async (def) => {
      const images = await getImageFromApi(def);
      setGroups((prev) =>
        [...prev, { def, images }].sort((a, b) => {
          const aIndex = defs.findIndex((item) => item === a.def);
          const bIndex = defs.findIndex((item) => item === b.def);
          return aIndex - bIndex;
        }),
      );
    });

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, [apiDefs, defs, initialState]);

  publishDbgObject('last images', groups);
  return { loading, groups: groups.filter((group) => group.images.length > 0) };
};
