export const addHoverPaint = (origStyle) => {
  const hoverExpr = ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 1]; // prettier-ignore
  const iconOpacity = ['case', ['boolean', ['feature-state', 'hideIcon'], false], 0, hoverExpr]; // prettier-ignore

  origStyle.layers
    .filter(
      (layer) =>
        layer['source-layer'] === 'poi' ||
        layer['source-layer'] === 'outdoor_poi',
    )
    .forEach((layer) => {
      if (layer.paint) {
        // TODO for outdoor style they use it for hiding icons by zoom layer id:'Outdoor'
        layer.paint['icon-opacity'] = iconOpacity; // eslint-disable-line no-param-reassign
        layer.paint['text-opacity'] = iconOpacity; // eslint-disable-line no-param-reassign
      }
    });

  return origStyle;
};

export const setUpHover = (map, layersWithOsmId) => {
  let lastHover = null;

  const setHoverOn = (feature) =>
    feature && map.setFeatureState(feature, { hover: true });
  const setHoverOff = (feature) =>
    feature && map.setFeatureState(feature, { hover: false });

  const onMouseMove = (e) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      if (feature !== lastHover) {
        setHoverOff(lastHover);
        setHoverOn(feature);
        lastHover = feature;
        map.getCanvas().style.cursor = 'pointer'; // eslint-disable-line no-param-reassign
      }
    }
  };

  const onMouseLeave = () => {
    setHoverOff(lastHover);
    lastHover = null;
    // TODO delay 200ms
    map.getCanvas().style.cursor = ''; // eslint-disable-line no-param-reassign
  };

  layersWithOsmId.forEach((layer) => {
    map.on('mousemove', layer, onMouseMove);
    map.on('mouseleave', layer, onMouseLeave);
  });
};
