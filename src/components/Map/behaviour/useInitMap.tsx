import React from 'react';
import maplibregl from 'maplibre-gl';
import { basicStyle } from '../styles/basicStyle';
import { setGlobalMap } from '../../../services/mapStorage';
import { COMPASS_TOOLTIP } from '../useAddTopRightControls';

// There are plenty of errors like this:
//   Image "office_11" could not be loaded. Please make sure you have added the image with map.addImage() or a "sprite" property in your style. You can provide missing images by listening for the "styleimagemissing" map event.
// As we don't have the icons yet, lets filter everything out. There is no way to turn it off.
const filterConsoleLog = () => {
  const original = console.warn; // eslint-disable-line no-console

  // eslint-disable-next-line no-console
  console.warn = (message: any, ...optionalParams: any[]) => {
    if (
      typeof message === 'string' &&
      !message.includes(
        'Please make sure you have added the image with map.addImage',
      )
    ) {
      original.apply(console, [message, ...optionalParams]);
    }
  };
};

// const renderAllMissingIconsRed = (map: maplibregl.Map) => {
//   map.on('styleimagemissing', (e) => {
//     const width = 12;
//     const data = new Uint8Array(width * width * 4);
//     for (let x = 0; x < width; x++) {
//       for (let y = 0; y < width; y++) {
//         const offset = (y * width + x) * 4;
//         data[offset + 0] = 255;
//         data[offset + 1] = 0;
//         data[offset + 2] = 0;
//         data[offset + 3] = 255; // alpha
//       }
//     }
//     map.addImage(e.id, { width, height: width, data });
//   });
// };

export const useInitMap = () => {
  const mapRef = React.useRef(null);
  const [mapInState, setMapInState] = React.useState(null);

  React.useEffect(() => {
    if (!mapRef.current) return undefined;

    filterConsoleLog();

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: basicStyle,
      attributionControl: false,
      refreshExpiredTiles: false,
      locale: {
        'NavigationControl.ResetBearing': COMPASS_TOOLTIP,
      },
    });
    setGlobalMap(map);
    setMapInState(map);
    map.scrollZoom.setWheelZoomRate(1 / 200); // 1/450 is default, bigger value = faster

    return () => {
      setGlobalMap(null);
      map?.remove();
    };
  }, [mapRef]);

  return [mapInState, mapRef];
};
