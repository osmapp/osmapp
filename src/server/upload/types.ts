import type { LonLat } from '../../services/types';

export type File = {
  filepath: string;
  filename: string;
  location: LonLat | null;
  date: Date;
};
