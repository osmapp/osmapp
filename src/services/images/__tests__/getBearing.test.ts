import { Position } from '../../types';
import { getBearing } from '../getImageFromCenterFactory';

jest.mock('maplibre-gl', () => ({}));

const point: Position = [0, 0];
const pointAbove: Position = [0, 1];
const point45: Position = [1, 1];
const pointRight: Position = [1, 0];
const pointBelow: Position = [0, -1]; // 180
const point225: Position = [-1, -1]; // 180+45
const pointLeft: Position = [-1, 0];

const praha: Position = [14.3, 50.1]; // lon, lat  --> x,y
const liberec: Position = [15.05, 50.75];

describe('getBearing', () => {
  it('should work for node', async () => {
    //      pA  p45
    //      | /
    // pL - p - pR
    //    / |
    // p225 pB
    expect(getBearing(point, pointAbove)).toEqual(0);
    expect(getBearing(point, point45)).toEqual(45);
    expect(getBearing(point, pointRight)).toEqual(90);
    expect(getBearing(point, pointBelow)).toEqual(180);
    expect(getBearing(point, point225)).toEqual(225);
    expect(getBearing(point, pointLeft)).toEqual(270);

    expect(Math.round(getBearing(praha, liberec))).toEqual(49);
  });
});
