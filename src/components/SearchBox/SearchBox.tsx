import React, { useEffect, useState } from 'react';
import Router from 'next/router';
// headlessUI
import { Combobox } from '@headlessui/react';
// icons
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
// context
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
// helpers
import { t } from '../../services/intl';
import { useMobileMode } from '../helpers';
import { fetchChoices } from './searchBoxUtils';
import { onHighlightFactory, onSelected } from './onSelected';
// components
import SearchChoice from './SearchChoice';

interface Choice {
  id: string;
  properties: {
    name: string;
  };
}

const useFetchChoices = (
  query: string,
  setChoices: (value: Choice[]) => void,
  setSelectedChoice: (value: Choice | null) => void,
) => {
  const { view } = useMapStateContext();
  useEffect(() => {
    if (query === '') {
      setChoices([]);
      setSelectedChoice(null);
      return;
    }
    // fetch choices
    fetchChoices(query, view, setChoices);
  }, [query]);
};

const useGetClosePanel = (setQuery: (value: string) => void) => {
  const mobileMode = useMobileMode();
  const { feature, setFeature, setPreview } = useFeatureContext();

  return () => {
    setQuery('');
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };
};

const useOnSelectedChoice = (selectedChoice: Choice) => {
  const mobileMode = useMobileMode();
  const { setFeature, setPreview } = useFeatureContext();

  useEffect(() => {
    if (selectedChoice === null) return;
    onSelected(setFeature, setPreview, mobileMode, selectedChoice);
  }, [selectedChoice]);
};

const SearchInput = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (string) => void;
}) => {
  const { setPreview } = useFeatureContext();

  const onInputChange = (event) => {
    setQuery(event.target.value);
    onHighlightFactory(setPreview, {});
  };

  return (
    <Combobox.Input
      className="bg-white dark:bg-zinc-800 shadow-md shadow-black/20 rounded-lg placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-800 dark:text-zinc-200 pl-12 w-full h-12 outline-0 transition truncate"
      // @ts-ignore
      placeholder={t('searchbox.placeholder')}
      displayValue={(choice: Choice | null) => {
        if (choice === null) return query;
        return choice.properties.name;
      }}
      onChange={onInputChange}
      spellCheck="false"
    />
  );
};

const ComboBoxChoices = ({
  choices,
  query,
}: {
  choices: Choice[];
  query: string;
}) => (
  <Combobox.Options className="rounded-md overflow-y-auto shadow-md shadow-black/20 z-10 scrollbar-thin scrollbar-track-white dark:scrollbar-track-zinc-800 scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-full">
    {choices.map((choice) => (
      <Combobox.Option key={choice.id} value={choice}>
        {({ active }) => (
          <li
            className={`flex justify-between p-2 transition duration-10 ${
              active
                ? 'bg-zinc-200 dark:bg-zinc-700'
                : 'bg-white dark:bg-zinc-800'
            }`}
          >
            <SearchChoice query={query} choice={choice} />
          </li>
        )}
      </Combobox.Option>
    ))}
  </Combobox.Options>
);

const CloseButton = ({ closePanel }: { closePanel: () => void }) => {
  const { featureShown } = useFeatureContext();
  return (
    <>
      {featureShown && (
        <button
          type="button"
          onClick={closePanel}
          className="flex items-center justify-center w-full h-full"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-400" />
        </button>
      )}
    </>
  );
};

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const closePanel = useGetClosePanel(setQuery);

  useFetchChoices(query, setChoices, setSelectedChoice);
  useOnSelectedChoice(selectedChoice);

  return (
    <Combobox value={selectedChoice} onChange={setSelectedChoice}>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center pointer-events-none text-zinc-400 aspect-square">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <div className="absolute top-0 bottom-0 right-0 aspect-square">
          <CloseButton closePanel={closePanel} />
        </div>
        <SearchInput query={query} setQuery={setQuery} />
      </div>
      <ComboBoxChoices choices={choices} query={query} />
    </Combobox>
  );
};

export default SearchBox;
