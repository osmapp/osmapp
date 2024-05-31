import { ClimbingRoute } from './types';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useClimbingContext } from './contexts/ClimbingContext';
import { Change, editCrag } from '../../../services/osmApiAuth';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { getFeaturePhotoKeys } from './utils/photo';
import { getOsmTagFromGradeSystem } from './utils/routeGrade';

const WIKIMEDIA_COMMONS = 'wikimedia_commons';

const getPathString = (path) =>
  path.length === 0
    ? undefined // TODO if there was empty key='', we will delete it, even though we shouldn't
    : path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

export const getNewPhotoIndex = (photoKeys: Array<string>) => {
  const maxKey = photoKeys.reduce((max, item) => {
    if (item === WIKIMEDIA_COMMONS) return Math.max(max, 1);

    const parts = item.split(':');
    if (parts[0] === WIKIMEDIA_COMMONS && parts.length > 1) {
      const number = parseInt(parts[1], 10);
      if (!Number.isNaN(number)) {
        return Math.max(max, number);
      }
    }
    return max;
  }, 0);

  return maxKey + 1;
};

const getNewPhotoKey = (photoIndex: number, offset: number) => {
  const photoIndexWithOffset = photoIndex + offset;
  return `${WIKIMEDIA_COMMONS}${
    photoIndexWithOffset === 1 ? '' : `:${photoIndexWithOffset}`
  }`;
};

const getUpdatedBasicTags = (route: ClimbingRoute) => {
  const checkedTags = ['name', 'description', 'author'];
  const updatedTags = {};
  checkedTags.forEach((tagToCheck) => {
    if (route[tagToCheck] !== route.feature.tags[tagToCheck]) {
      updatedTags[tagToCheck] = route[tagToCheck];
    }
  });

  const newGradeSystem = route.difficulty.gradeSystem;
  const gradeSystemKey = getOsmTagFromGradeSystem(newGradeSystem);
  const featureDifficulty = route.feature.tags[gradeSystemKey];

  const isGradeUpdated = route.difficulty.grade !== featureDifficulty;

  if (isGradeUpdated) {
    updatedTags[gradeSystemKey] = route.difficulty.grade;
    // @TODO: delete previous grade? if(!featureDifficulty)
  }

  return updatedTags;
};

const getUpdatedPhotoTags = (route: ClimbingRoute) => {
  const updatedTags = {};
  const photoKeys = getFeaturePhotoKeys(route.feature);
  const newPhotoIndex = getNewPhotoIndex(photoKeys);

  let offset = 0;
  Object.entries(route.paths).forEach(([photoName, points]) => {
    const newPhotoKeyWithOffset = getNewPhotoKey(newPhotoIndex, offset);
    const currentPhotoKey = route.photoToKeyMap[photoName];

    updatedTags[`${currentPhotoKey ?? newPhotoKeyWithOffset}:path`] =
      getPathString(points);
    if (!currentPhotoKey) {
      updatedTags[newPhotoKeyWithOffset] = `File:${photoName}`;
      offset += 1;
    }
  });
  return updatedTags;
};

const isSameTags = (updatedTags: {}, origTags: FeatureTags) => {
  const isSame = Object.keys(updatedTags).every(
    (key) => origTags[key] === updatedTags[key],
  );
  return isSame;
};

const getChanges = (routes: ClimbingRoute[]): Change[] => {
  const existingRoutes = routes.filter((route) => route.feature); // TODO new routes

  return existingRoutes
    .map((route) => {
      const updatedTags = {
        ...getUpdatedBasicTags(route),
        ...getUpdatedPhotoTags(route),
      };
      const isSame = isSameTags(updatedTags, route.feature.tags);
      return isSame
        ? undefined
        : {
            feature: route.feature,
            allTags: {
              ...route.feature.tags,
              ...updatedTags,
            },
          };
    })
    .filter(Boolean);
};

export const useGetHandleSave = (
  setIsEditMode: (value: boolean | ((old: boolean) => boolean)) => void,
) => {
  const { feature: crag } = useFeatureContext();
  const { routes } = useClimbingContext();

  return async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to save?') === false) {
      return;
    }

    const changes = getChanges(routes);
    const comment = `${changes.length} routes`;
    const result = await editCrag(crag, comment, changes);

    console.log('All routes saved', result); // eslint-disable-line no-console
    setIsEditMode(false);
  };
};
