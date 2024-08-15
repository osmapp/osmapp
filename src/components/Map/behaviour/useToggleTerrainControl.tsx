/* eslint-disable  no-underscore-dangle */
import maplibregl from 'maplibre-gl';
import { createMapEventHook } from '../../helpers';

const TERRAIN = {
  source: 'terrain-rgb',
  exaggeration: 1,
};

const turnOnTerrain = (map) => {
  map.setTerrain(TERRAIN);
  map.setMaxPitch(85);
};

const turnOffTerrain = (map) => {
  map.setTerrain(null);
  map.setMaxPitch(60);
};

class OsmappTerrainControl extends maplibregl.TerrainControl {
  _toggleTerrain = () => {
    if (this._map.getTerrain()) {
      turnOffTerrain(this._map);
    } else {
      turnOnTerrain(this._map);
    }
    this._updateTerrainIcon();
  };
}

const terrainControl = new OsmappTerrainControl(TERRAIN);

let added = false;

export const useToggleTerrainControl = createMapEventHook((map) => ({
  eventType: 'move',
  eventHandler: () => {
    if (map.getPitch() > 0 && !added) {
      map.addControl(terrainControl);
      turnOnTerrain(map);
      added = true;
    }
  },
}));
