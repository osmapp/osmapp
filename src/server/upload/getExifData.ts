import exifr from 'exifr';
import { LonLat } from '../../services/types';

export const getExifData = async (url: string) => {
  const exif = await exifr.parse(url);

  const location =
    exif?.latitude && exif?.longitude ? [exif.longitude, exif.latitude] : null;

  const date = exif?.DateTimeOriginal
    ? new Date(exif.DateTimeOriginal)
    : new Date();

  return { location, date } as { location: LonLat | null; date: Date };
};
