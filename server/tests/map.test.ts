import { map } from './map';

describe('map', () => {
  test('calls the transform function once per item with correct arguments', () => {
    const spy = jest.fn((x) => x * 2);
    const input = [1, 2, 3];

    map(input, spy);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 1);
    expect(spy).toHaveBeenNthCalledWith(2, 2);
    expect(spy).toHaveBeenNthCalledWith(3, 3);
  });

  test('returns transformed values', () => {
    const result = map([1, 2, 3], (x) => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  test('returns empty array when given empty array', () => {
    const spy = jest.fn();
    const result = map([], spy);
    expect(spy).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
