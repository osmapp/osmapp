import { Feature, FeatureTags, LonLat } from '../../../services/types';
import { getApiId, getShortId } from '../../../services/helpers';
import { getLabel } from '../../../helpers/featureLabel';
import { Setter } from '../../../types';
import { useMemo, useState } from 'react';
import { publishDbgObject } from '../../../utils';
import { findPreset } from '../../../services/tagging/presets';
import { getPresetTranslation } from '../../../services/tagging/translations';
import { getNewId } from '../../../services/getCoordsFeature';
import { fetchParentFeatures } from '../../../services/osm/fetchParentFeatures';
import { fetchWays } from '../../../services/osm/fetchWays';

export type TagsEntries = [string, string][];

export type Members = Array<{
  shortId: string;
  role: string;
  label: string; // cached from other dataItems, or from originalFeature
}>;

// internal type stored in the state
type DataItem = {
  shortId: string;
  tagsEntries: TagsEntries;
  toBeDeleted: boolean;
  members: Members | undefined;
  version: number | undefined; // undefined for new item
  nodeLonLat: LonLat | undefined; // undefined for ways and relations
};

export type EditDataItem = DataItem & {
  setTagsEntries: SetTagsEntries;
  tags: FeatureTags;
  setTag: (k: string, v: string) => void;
  presetKey: string;
  presetLabel: string;
  setMembers: SetMembers;
  setShortId: SetShortId;
  setNodeLonLat: (lonLat: LonLat) => void;
  toggleToBeDeleted: () => void;
  convertToRelation: ConvertToRelation;
};

const buildDataItem = (feature: Feature): DataItem => {
  const apiId = feature.osmMeta;
  return {
    shortId: getShortId(apiId),
    version: apiId.version,
    tagsEntries: Object.entries(feature.tags),
    toBeDeleted: false,
    members:
      feature.memberFeatures?.map((memberFeature) => ({
        shortId: getShortId(memberFeature.osmMeta),
        role: memberFeature.osmMeta.role,
        label: getLabel(memberFeature),
      })) ??
      feature.members?.map((member) => ({
        shortId: getShortId({ type: member.type, id: member.ref }),
        role: member.role,
        label: `${member.type} ${member.ref}`,
      })),
    nodeLonLat: apiId.type === 'node' ? feature.center : undefined,
  };
};

const getPresetKey = ({ shortId, tagsEntries }: DataItem) => {
  const tags = Object.fromEntries(tagsEntries);
  const osmId = getApiId(shortId);
  const preset = findPreset(osmId.type, tags);
  return preset.presetKey;
};

const getName = (d: DataItem): string | undefined =>
  d.tagsEntries.find(([k]) => k === 'name')?.[1];

const someNameHasChanged = (prevData: DataItem[], newData: DataItem[]) => {
  const prevNames = prevData.map((d) => getName(d));
  const newNames = newData.map((d) => getName(d));
  return prevNames.some((name, index) => name !== newNames[index]);
};

const updateAllMemberLabels = (newData: DataItem[], shortId: string) => {
  // TODO this code is ugly, but we would have to remove the "one state"
  const referencingParents = new Set<string>();
  newData.forEach((dataItem) => {
    dataItem.members?.forEach((member) => {
      if (member.shortId === shortId) {
        referencingParents.add(dataItem.shortId);
      }
    });
  });

  const currentItem = newData.find((dataItem) => dataItem.shortId === shortId);

  return newData.map((dataItem) => {
    if (referencingParents.has(dataItem.shortId)) {
      const clone = JSON.parse(JSON.stringify(dataItem)) as DataItem;
      const index = clone.members.findIndex(
        (member) => member.shortId === shortId,
      );
      clone.members[index].label = getName(currentItem);
      return clone;
    } else {
      return dataItem;
    }
  });
};

type SetDataItem = (updateFn: (prevValue: DataItem) => DataItem) => void;
const setDataItemFactory =
  (setData: Setter<DataItem[]>, shortId: string): SetDataItem =>
  (updateFn) => {
    setData((prevData) => {
      const newData = prevData.map((item) =>
        item.shortId === shortId ? updateFn(item) : item,
      );

      if (someNameHasChanged(prevData, newData)) {
        // only current item can change, but this check is cheap
        return updateAllMemberLabels(newData, shortId);
      }
      return newData;
    });
  };

type ConvertToRelation = () => Promise<string>;
const convertToRelationFactory =
  (setData: Setter<DataItem[]>, shortId: string): ConvertToRelation =>
  async () => {
    const [parentFeatures, waysFeatures] = await Promise.all([
      fetchParentFeatures(getApiId(shortId)),
      fetchWays(getApiId(shortId)),
    ]);

    if (waysFeatures.length > 0) {
      throw new Error(`Can't convert node ${shortId} which is part of a way`);
    }

    const newShortId = `r${getNewId()}`;
    setData((prevData) => {
      // TODO - don't delete natural=peak - leave it as node
      const newData = prevData.map((item) =>
        item.shortId === shortId ? { ...item, toBeDeleted: true } : item,
      );
      const currentItem = prevData.find((item) => item.shortId === shortId);

      const newRelation: DataItem = {
        shortId: newShortId,
        version: undefined,
        tagsEntries: currentItem.tagsEntries,
        toBeDeleted: false,
        members: [],
        nodeLonLat: undefined,
      };

      // update member id in all parent relations
      const parentItems = parentFeatures.map((feature) => {
        const dataItem = buildDataItem(feature);
        return {
          ...dataItem,
          members: dataItem.members.map((member) =>
            member.shortId === shortId
              ? {
                  ...member,
                  shortId: newShortId,
                  label: getName(currentItem) ?? newShortId,
                }
              : member,
          ),
        };
      });

      return [...newData, ...parentItems, newRelation];
    });

    return newShortId;
  };

type SetTagsEntries = (updateFn: (prev: TagsEntries) => TagsEntries) => void;
const setTagsEntriesFactory =
  (setDataItem: SetDataItem, tagsEntries: TagsEntries): SetTagsEntries =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      tagsEntries: updateFn(tagsEntries),
    }));

type SetShortId = (shortId: string) => void;
const setShortIdFactory =
  (setDataItem: SetDataItem): SetShortId =>
  (shortId) =>
    setDataItem((prev) => ({
      ...prev,
      shortId: shortId,
    }));

type SetMembers = (updateFn: (prev: Members) => Members) => void;
const setMembersFactory =
  (setDataItem: SetDataItem, members: Members): SetMembers =>
  (updateFn) =>
    setDataItem((prev) => ({
      ...prev,
      members: updateFn(members),
    }));

type SetNodeLonLat = (lonLat: LonLat) => void;
const setNodeLonLatFactory =
  (setDataItem: SetDataItem): SetNodeLonLat =>
  (lonLat) =>
    setDataItem((prev) => ({
      ...prev,
      nodeLonLat: lonLat,
    }));

type SetTag = (k: string, v: string) => void;
const setTagFactory =
  (setTagsEntries: SetTagsEntries): SetTag =>
  (k, v) => {
    setTagsEntries((prev) => {
      const position = prev.findIndex(([key]) => key === k);
      return position === -1
        ? [...prev, [k, v]]
        : prev.map((entry, index) => (index === position ? [k, v] : entry));
    });
  };

const toggleToBeDeletedFactory = (setDataItem: SetDataItem) => {
  return () =>
    setDataItem((prev) => ({
      ...prev,
      toBeDeleted: !prev.toBeDeleted,
    }));
};

export const useEditItems = (originalFeature: Feature) => {
  const [data, setData] = useState<DataItem[]>(() => [
    buildDataItem(originalFeature),
  ]);

  const items = useMemo<Array<EditDataItem>>(
    () =>
      data.map((dataItem) => {
        const { shortId, tagsEntries, members } = dataItem;
        const setDataItem = setDataItemFactory(setData, shortId);
        const setTagsEntries = setTagsEntriesFactory(setDataItem, tagsEntries);
        const setMembers = setMembersFactory(setDataItem, members);
        const presetKey = getPresetKey(dataItem);
        return {
          ...dataItem,
          setTagsEntries,
          setShortId: setShortIdFactory(setDataItem),
          tags: Object.fromEntries(tagsEntries),
          setTag: setTagFactory(setTagsEntries),
          toggleToBeDeleted: toggleToBeDeletedFactory(setDataItem),
          setMembers,
          setNodeLonLat: setNodeLonLatFactory(setDataItem),
          presetKey,
          presetLabel: getPresetTranslation(presetKey),
          convertToRelation: convertToRelationFactory(setData, shortId),
        };
        // TODO maybe keep reference to original EditDataItem if DataItem didnt change? #performance
      }),
    [data],
  );

  const addFeature = (feature: Feature) => {
    const newItem = buildDataItem(JSON.parse(JSON.stringify(feature)));
    setData((state) => [...state, newItem]);
  };

  publishDbgObject('EditContext state', data);

  return { items, addFeature };
};
