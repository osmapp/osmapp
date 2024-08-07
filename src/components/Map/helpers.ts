import { OsmApiId } from '../../services/helpers';
import { isBrowser } from '../helpers';
import { getGlobalMap } from '../../services/mapStorage';

const isOsmLayer = (id) => {
  if (id.startsWith('place-country-')) return false; // https://github.com/zbycz/osmapp/issues/35
  if (id === 'place-continent') return false;
  if (id === 'water-name-ocean') return false;
  const prefixes = ['water-name-', 'poi-', 'place-', 'overpass-', 'climbing-'];
  return prefixes.some((prefix) => id.startsWith(prefix));
};

export const layersWithOsmId = (style) =>
  style.layers // TODO make it custom for basic/outdoor + revert place_
    .filter(
      (layer) =>
        layer['source-layer'] === 'poi' ||
        layer['source-layer'] === 'outdoor_poi',
    )
    .map((x) => x.id);
// .filter((id) => isOsmLayer(id));

export const getIsOsmObject = ({ id, layer }) => {
  // these layers with id <= ~10000 are broken
  // eg. US states
  if (layer.id === 'place-other' && id < 10e5) {
    return false;
  }
  // eg. "Mediterranean Sea"
  if (layer.id === 'water-name-other' && id < 10e5) {
    return false;
  }

  if (layer.id?.startsWith('overpass') || layer.id?.startsWith('climbing-')) {
    return true;
  }

  return layersWithOsmId(getGlobalMap().getStyle()).includes(layer.id);
};

export const convertMapIdToOsmId = (feature) => {
  if (!feature || !feature.id) return false;

  const mapId = `${feature.id}`;
  const id = mapId.substring(0, mapId.length - 1);
  const numType = mapId.substring(mapId.length - 1);
  const mapTypeToOsm = { 0: 'node', 1: 'way', 4: 'relation' };

  return { id, type: mapTypeToOsm[numType] ?? `type${numType}` };
};

export const convertOsmIdToMapId = (apiId: OsmApiId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

// maplibregl.supported() no longer exists
// copied from https://maplibre.org/maplibre-gl-js/docs/examples/check-for-support/
const isWebglSupported = () => {
  if (window.WebGLRenderingContext) {
    const canvas = document.createElement('canvas');
    try {
      // Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
      // to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
      // for more details.
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (context && typeof context.getParameter === 'function') {
        return true;
      }
    } catch (e) {
      // WebGL is supported, but disabled
    }
    return false;
  }
  // WebGL not supported
  return false;
};

export const webglSupported = isBrowser() ? isWebglSupported() : true;
