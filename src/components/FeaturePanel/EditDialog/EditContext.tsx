import React, { createContext, useContext, useMemo, useState } from 'react';
import { useToggleState } from '../../helpers';
import { Feature, FeatureTags, SuccessInfo } from '../../../services/types';
import { Setter } from '../../../types';

export type TagsEntries = [string, string][];

type EditContextType = {
  successInfo: undefined | SuccessInfo;
  setSuccessInfo: (info: undefined | SuccessInfo) => void;
  isSaving: boolean;
  setIsSaving: (b: boolean) => void;
  location: string;
  setLocation: (s: string) => void;
  comment: string;
  setComment: (s: string) => void;
  presetKey: string;
  setPresetKey: Setter<string>;
  tags: {
    tagsEntries: TagsEntries;
    setTagsEntries: Setter<TagsEntries>;
    tags: FeatureTags;
    setTag: (k: string, v: string) => void;
    cancelled: boolean;
    toggleCancelled: () => void;
  };
};

const useTagsState = (initialTags: FeatureTags): EditContextType['tags'] => {
  const [tagsEntries, setTagsEntries] = useState<TagsEntries>(() =>
    Object.entries(initialTags),
  );
  const tags = useMemo(() => Object.fromEntries(tagsEntries), [tagsEntries]);

  const setTag = (k: string, v: string) => {
    setTagsEntries((state) => {
      const position = state.findIndex(([key]) => key === k);
      if (position === -1) {
        return [...state, [k, v]];
      }
      return state.map((entry, index) => (index === position ? [k, v] : entry));
    });
  };

  const [cancelled, toggleCancelled] = useToggleState(false);

  return {
    tagsEntries,
    setTagsEntries,
    tags,
    setTag,
    cancelled,
    toggleCancelled,
  };
};

const EditContext = createContext<EditContextType>(undefined);

type Props = {
  feature: Feature;
  children: React.ReactNode;
};

export const EditContextProvider = ({ feature, children }: Props) => {
  const [successInfo, setSuccessInfo] = useState<undefined | SuccessInfo>();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const tags = useTagsState(feature.tags);
  const [presetKey, setPresetKey] = useState(''); // only cache, real data in tags

  const value: EditContextType = {
    successInfo,
    setSuccessInfo,
    isSaving,
    setIsSaving,
    location,
    setLocation,
    comment,
    setComment,
    presetKey,
    setPresetKey,
    tags,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEditContext = () => useContext(EditContext);
