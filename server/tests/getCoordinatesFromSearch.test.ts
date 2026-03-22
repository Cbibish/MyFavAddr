import axios from "axios";
import { getCoordinatesFromSearch } from "../src/utils/getCoordinatesFromSearch";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCoordinatesFromSearch", () => {
  afterEach(() => jest.resetAllMocks());

  test("returns coordinates when API returns valid features", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        features: [
          { geometry: { coordinates: [2.3522, 48.8566] } }
        ]
      }
    });
    const result = await getCoordinatesFromSearch("Paris France");
    expect(result).toEqual({ lng: 2.3522, lat: 48.8566 });
  });

  test("returns null when features array is empty", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { features: [] }
    });
    const result = await getCoordinatesFromSearch("zzzznotaplace");
    expect(result).toBeNull();
  });

  test("returns null when no feature has valid coordinates", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        features: [
          { geometry: { coordinates: [] } },
          { geometry: { coordinates: [1] } },
        ]
      }
    });
    const result = await getCoordinatesFromSearch("badplace");
    expect(result).toBeNull();
  });

  test("returns null when features is not an array", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { features: null }
    });
    const result = await getCoordinatesFromSearch("test");
    expect(result).toBeNull();
  });

  test("returns null when data has no features key", async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const result = await getCoordinatesFromSearch("test");
    expect(result).toBeNull();
  });

  test("returns null and logs error when axios throws", async () => {
    mockedAxios.get.mockRejectedValue(new Error("network error"));
    const result = await getCoordinatesFromSearch("Paris");
    expect(result).toBeNull();
  });

  test("calls the API with the correct encoded URL", async () => {
    mockedAxios.get.mockResolvedValue({ data: { features: [] } });
    await getCoordinatesFromSearch("Paris France");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://data.geopf.fr/geocodage/search?q=Paris%20France"
    );
  });
});
