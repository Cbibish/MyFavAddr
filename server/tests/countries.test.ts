import { getCountriesStartingWith } from './countries';

const mockApiResponse = {
  data: {
    FR: { country: 'France', region: 'Europe' },
    FI: { country: 'Finland', region: 'Europe' },
    DE: { country: 'Germany', region: 'Europe' },
    GH: { country: 'Ghana', region: 'Africa' },
    US: { country: 'United States of America ', region: 'North America' },
    GB: { country: 'United Kingdom of Great Britain and Northern Ireland', region: 'Europe' },
  }
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockApiResponse)
  } as any);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('getCountriesStartingWith', () => {

  test('returns countries starting with "F"', async () => {
    const result = await getCountriesStartingWith('F');
    expect(result).toEqual(['France', 'Finland']);
  });

  test('returns countries starting with "G"', async () => {
    const result = await getCountriesStartingWith('G');
    expect(result).toEqual(['Germany', 'Ghana']);
  });

  test('is case insensitive', async () => {
    const result = await getCountriesStartingWith('f');
    expect(result).toEqual(['France', 'Finland']);
  });

  test('returns empty array when no match', async () => {
    const result = await getCountriesStartingWith('Z');
    expect(result).toEqual([]);
  });

  test('returns all countries when empty string is passed', async () => {
    const result = await getCountriesStartingWith('');
    expect(result).toHaveLength(6);
  });

  test('calls the API exactly once', async () => {
    await getCountriesStartingWith('F');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.first.org/data/v1/countries?limit=1000');
  });

});