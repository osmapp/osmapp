import React from 'react';
import {
  getImageDefId,
  ImageType,
} from '../../../services/images/getImageDefs';
import { ImageDef } from '../../../services/types';

export const BgImg = ({ url }: { url: string }) => (
  <img
    src={url}
    style={{
      inset: '0px',
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      position: 'absolute',
      display: 'inline-block',
      filter: 'blur(4px)',
    }}
    loading="lazy"
  />
);

const MainImg = React.forwardRef<
  HTMLImageElement,
  { url: string; alt: string; children?: React.ReactNode }
>(({ url, alt, children }, ref) => (
  <div
    style={{
      position: 'absolute',
      inset: '0',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <img
      ref={ref}
      src={url}
      alt={alt}
      style={{
        objectFit: 'contain',
        height: '100%',
        width: '100%',
        display: 'inline-block',
      }}
      loading="lazy"
    />
    {children}
  </div>
));

MainImg.displayName = 'MainImg';

type ImageProps = {
  image: ImageType;
  def: ImageDef;
  high: boolean;
  wide: boolean;
  children?: React.ReactNode;
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ image, def, high, wide, children }, ref) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...(high ? { gridRow: 'span 2' } : {}),
        ...(wide ? { gridColumn: 'span 2' } : {}),
      }}
    >
      <BgImg url={image.imageUrl} />
      <MainImg url={image.imageUrl} alt={getImageDefId(def)} ref={ref}>
        {children}
      </MainImg>
    </div>
  ),
);

Image.displayName = 'Image';
