import React from 'react';
import Cookies from 'js-cookie';

import FeaturePanel from '../FeaturePanel/FeaturePanel';
import Map from '../Map/Map';
import SearchBox from '../SearchBox/SearchBox';
import { MapStateProvider, useMapStateContext } from '../utils/MapStateContext';
import { getInitialMapView, getInititalFeature } from './helpers';
import { HomepagePanel } from '../HomepagePanel/HomepagePanel';
import { Loading } from './Loading';
import { FeatureProvider, useFeatureContext } from '../utils/FeatureContext';

const usePersistMapView = () => {
  const { view } = useMapStateContext();
  React.useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/')); // TODO longer expire
  }, [view]);
};

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();
  const [lastFeature, setLastFeature] = React.useState(feature);

  React.useEffect(() => {
    const viewAlreadyUpdated = feature?.skeleton || lastFeature?.skeleton;

    if (!viewAlreadyUpdated && feature?.center) {
      const [lon, lat] = feature.center;
      setView([17, lat, lon]);
    }

    setLastFeature(feature);
  }, [feature]);
};

const IndexWithProviders = () => {
  const { featureShown } = useFeatureContext();

  useUpdateViewFromFeature();
  usePersistMapView();

  return (
    <>
      <SearchBox />
      <Loading />
      {featureShown && <FeaturePanel />}
      <HomepagePanel />
      <Map />
    </>
  );
};

const getMapViewFromHash = () =>
  typeof window !== 'undefined' &&
  window.location.hash &&
  window.location.hash.substr(1).split('/'); // TODO return only valid mapView

const App = ({ featureFromRouter, initialMapView }) => {
  const mapView = getMapViewFromHash() || initialMapView;
  return (
    <FeatureProvider featureFromRouter={featureFromRouter}>
      <MapStateProvider initialMapView={mapView}>
        <IndexWithProviders />
      </MapStateProvider>
    </FeatureProvider>
  );
};
App.getInitialProps = async (ctx) => {
  const featureFromRouter = await getInititalFeature(ctx);
  const initialMapView = await getInitialMapView(ctx);
  return { featureFromRouter, initialMapView };
};

// map.fitBounds(bounds, {
//   padding: 20,
// });

export default App;
