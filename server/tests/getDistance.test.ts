import { getDistance } from '../src/utils/getDistance';

describe('getDistance', () => {
  test('returns 0 when both points are the same', () => {
    const point = { lat: 48.8566, lng: 2.3522 };
    expect(getDistance(point, point)).toBe(0);
  });

  test('returns correct distance between Paris and Lyon (~392km)', () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.7640, lng: 4.8357 };
    const distance = getDistance(paris, lyon);
    expect(distance).toBeCloseTo(392, -1);
  });

  test('is symmetric - distance A to B equals B to A', () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.7640, lng: 4.8357 };
    expect(getDistance(paris, lyon)).toBe(getDistance(lyon, paris));
  });

  test('returns a positive number', () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.7640, lng: 4.8357 };
    expect(getDistance(paris, lyon)).toBeGreaterThan(0);
  });
});
