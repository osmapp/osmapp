import { OsmType, RelationMember } from '../types';

export type OsmElement<T extends OsmType = 'node' | 'way' | 'relation'> = {
  type: T;
  id: number;
  lat: number;
  lon: number;
  timestamp: string;
  version: number;
  changeset: number;
  user: string;
  uid: number;
  tags: Record<string, string>;
  members?: RelationMember[];
};

export type OsmResponse = {
  elements: OsmElement[];
};