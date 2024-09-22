import React from 'react';
import { encodeUrl } from '../../../../helpers/utils';

import { useState, useEffect } from 'react';

export const PanoramaImg = ({ url }: { url: string }) => {
  const [configUrl, setConfigUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentConfigUrl = `${window.location.protocol}//${window.location.host}/pannellum-config.json`;
    setConfigUrl(currentConfigUrl);
  }, []);

  if (!configUrl) {
    return null;
  }

  const pannellumUrl = encodeUrl`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${url}&config=${configUrl}`;

  return (
    <iframe
      title="panorama"
      allowFullScreen
      style={{
        borderStyle: 'none',
        width: '100%',
        height: '100%',
      }}
      src={pannellumUrl}
    />
  );
};
