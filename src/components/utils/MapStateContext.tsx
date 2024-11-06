import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePersistedState } from './usePersistedState';
import { DEFAULT_MAP } from '../../config.mjs';
import { PROJECT_ID } from '../../services/project';
import { useBoolState } from '../helpers';
import { Setter } from '../../types';

export type LayerIcon = React.ComponentType<{ fontSize: 'small' }>;

export interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer' | 'overlayClimbing';
  name?: string;
  url?: string;
  key?: string;
  Icon?: LayerIcon;
  attribution?: string[]; // missing in spacer TODO refactor ugly
  maxzoom?: number;
  minzoom?: number;
  bboxes?: number[][];
}

// [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
export type Bbox = [number, number, number, number];

// [z, lat, lon] - string because we use RoundedPosition
export type View = [string, string, string];

type MapStateContextType = {
  bbox: Bbox;
  setBbox: Setter<Bbox>;
  view: View;
  setView: Setter<View>;
  viewForMap: View;
  setViewFromMap: Setter<View>;
  activeLayers: string[];
  setActiveLayers: Setter<string[]>;
  userLayers: Layer[];
  setUserLayers: Setter<Layer[]>;
  mapLoaded: boolean;
  setMapLoaded: () => void;
};

export const MapStateContext = createContext<MapStateContextType>(undefined);

const useActiveLayersState = () => {
  const isClimbing = PROJECT_ID === 'openclimbing';
  const initLayers = isClimbing ? ['outdoor', 'climbing'] : [DEFAULT_MAP];
  return usePersistedState('activeLayers', initLayers);
};

export const MapStateProvider: React.FC<{ initialMapView: View }> = ({
  children,
  initialMapView,
}) => {
  const [activeLayers, setActiveLayers] = useActiveLayersState();
  const [bbox, setBbox] = useState<Bbox>();
  const [view, setView] = useState(initialMapView);
  const [viewForMap, setViewForMap] = useState(initialMapView);
  const [userLayers, setUserLayers] = usePersistedState<Layer[]>(
    'userLayerIndex',
    [],
  );

  const [mapLoaded, setMapLoaded, setNotLoaded] = useBoolState(true);
  useEffect(setNotLoaded, [setNotLoaded]);

  const setBothViews: Setter<View> = useCallback((newView) => {
    setView(newView);
    setViewForMap(newView);
  }, []);

  const mapState: MapStateContextType = {
    bbox,
    setBbox,
    view, // always up-to-date (for use in react)
    setView: setBothViews,
    viewForMap, // updated only when map has to be updated
    setViewFromMap: setView,
    activeLayers,
    setActiveLayers,
    userLayers,
    setUserLayers,
    mapLoaded,
    setMapLoaded,
  };

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
