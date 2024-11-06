import { Position } from '../types';
import { ImageType } from './getImageDefs';

export const getBearing = ([aX, aY]: Position, [bX, bY]: Position): number => {
  const angle = (Math.atan2(bX - aX, bY - aY) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
};

const subtractAngle = (a: number, b: number): number =>
  Math.min(Math.abs(a - b), a - b + 360);

type ImageProvider<T> = {
  getImages: (pos: Position) => Promise<T[]>;
  getImageCoords: (img: T) => Position;
  getImageAngle: (img: T) => number | undefined;
  isPano: (img: T) => boolean;
  getImageUrl: (img: T) => string;
  getImageDate: (img: T) => Date;
  getImageLink: (img: T) => string;
  getImageLinkUrl: (img: T) => string;
  getPanoUrl: (img: T) => string;
};

export const getImageFromCenterFactory =
  <T>(
    provider: string,
    {
      getImages,
      getImageCoords,
      getImageAngle,
      isPano,
      getImageUrl,
      getImageDate,
      getImageLink,
      getImageLinkUrl,
      getPanoUrl,
    }: ImageProvider<T>,
  ) =>
  async (poiCoords: Position): Promise<ImageType | null> => {
    const apiImages = await getImages(poiCoords);
    if (!apiImages.length) {
      return null;
    }

    const photos = apiImages.map((pic) => {
      const photoCoords = getImageCoords(pic);
      const angle = getImageAngle(pic);
      return {
        ...pic,
        angleFromPhotoToPoi: getBearing(photoCoords, poiCoords),
        deviationFromStraightSight:
          angle === undefined
            ? Infinity
            : subtractAngle(getBearing(photoCoords, poiCoords), angle),
      };
    });

    const panos = photos.filter(isPano);
    const sorted = (panos.length ? panos : photos).sort(
      (a, b) => a.deviationFromStraightSight - b.deviationFromStraightSight,
    );

    const imageToUse = sorted[0];

    return {
      provider,
      imageUrl: getImageUrl(imageToUse),
      description: `${provider} image from ${getImageDate(imageToUse).toLocaleString()}`,
      linkUrl: getImageLinkUrl(imageToUse),
      link: getImageLink(imageToUse),
      uncertainImage: true,
      panoramaUrl: isPano(imageToUse) ? getPanoUrl(imageToUse) : undefined,
    };
  };
