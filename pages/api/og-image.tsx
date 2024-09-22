import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { UserThemeProvider } from '../../src/helpers/theme';
import { Paths } from '../../src/components/FeaturePanel/ImagePane/PathsSvg';
import {
  Feature,
  ImageDefFromCenter,
  ImageDefFromTag,
} from '../../src/services/types';
import { fetchWithMemberFeatures } from '../../src/services/osmApi';
import { getImageFromApi } from '../../src/services/images/getImageFromApi';
import { getLogo, ProjectLogo } from '../../src/server/images/logo';
import { ImageType } from '../../src/services/images/getImageDefs';
import { fetchImage } from '../../src/server/images/fetchImage';
import {
  PNG_TYPE,
  sendImageResponse,
  SVG_TYPE,
} from '../../src/server/images/sendImageResponse';
import { svg2png } from '../../src/server/images/svg2png';
import { Size } from '../../src/components/FeaturePanel/ImagePane/types';
import { getApiId } from '../../src/services/helpers';
import { renderStyledHtml } from '../../src/server/images/renderStyledHtml';

const Svg = ({ children, size }) => (
  <UserThemeProvider userThemeCookie={undefined}>
    <svg
      viewBox={`0 0 ${size.width} ${size.height}`}
      width={size.width}
      height={size.height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  </UserThemeProvider>
);

const OG_SIZE = { width: 1200, height: 630 };

const centerInOgSize = (size: Size) => {
  const scale = Math.min(
    OG_SIZE.width / size.width,
    OG_SIZE.height / size.height,
  );
  const left = (OG_SIZE.width - size.width * scale) / 2;
  const top = (OG_SIZE.height - size.height * scale) / 2;
  return `translate(${left},${top}) scale(${scale})`;
};

const renderSvg = async (
  feature: Feature,
  def: ImageDefFromTag | ImageDefFromCenter,
  image: ImageType,
) => {
  const { size, dataUrl } = await fetchImage(image.imageUrl);
  const logo = getLogo(OG_SIZE, !!feature.tags.climbing);

  const Root = () => (
    <Svg size={OG_SIZE}>
      __PLACEHOLDER_FOR_STYLE__
      <g transform={centerInOgSize(size)}>
        <image href={dataUrl} width={size.width} height={size.height} />
        <Paths def={def} feature={feature} size={size} />
      </g>
      <ProjectLogo logo={logo} />
    </Svg>
  );

  const { html, styleTags } = renderStyledHtml(<Root />);
  return html.replace('__PLACEHOLDER_FOR_STYLE__', styleTags);
};

// on vercel node ~800ms in total
// - api/image: 838ms; fetchFeature: 496ms, getImage: 102ms, renderSvg: 38ms, svg2png: 202ms
// - api/image: 953ms; fetchFeature: 765ms, getImage: 0ms, renderSvg: 23ms, svg2png: 165ms
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const t1 = Date.now();
  try {
    const osmId = getApiId(req.query.id);
    const feature = await fetchWithMemberFeatures(osmId);
    const def = feature.imageDefs?.[0]; // TODO iterate when first not found
    if (!def) {
      throw new Error('No image definition found');
    }

    const t2 = Date.now();
    const image = await getImageFromApi(def);
    if (image.length === 0) {
      throw new Error(`Image failed to load from API: ${JSON.stringify(def)}`);
    }

    const t3 = Date.now();
    const svg = await renderSvg(feature, def, image[0]);

    if (req.query.svg) {
      sendImageResponse(res, feature, svg, SVG_TYPE);
      return;
    }

    const t4 = Date.now();
    const png = await svg2png(svg);

    const t5 = Date.now();
    // eslint-disable-next-line no-console
    console.log(
      `api/og-image: ${t5 - t1}ms; fetchFeature: ${t2 - t1}ms, getImageUrl: ${
        t3 - t2
      }ms, fetchImage+renderSvg: ${t4 - t3}ms, svg2png: ${t5 - t4}ms`,
    );

    sendImageResponse(res, feature, png, PNG_TYPE);
    return;
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
